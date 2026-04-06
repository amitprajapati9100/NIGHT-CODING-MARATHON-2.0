import "./env-config.js";

import mongoose from "mongoose";

mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 5000);

const DATABASE_DISCONNECTED_STATE = 0;
const DATABASE_READY_STATE = 1;
const DATABASE_CONNECTING_STATE = 2;
let connectionPromise = null;

mongoose.connection.on("disconnected", () => {
  connectionPromise = null;
});

export const isDatabaseConnected = () =>
  mongoose.connection.readyState === DATABASE_READY_STATE;

const stripWrappingQuotes = (value = "") => {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).trim();
  }

  return trimmedValue;
};

const normalizeMongoUri = (value) => {
  const sanitizedValue = stripWrappingQuotes(value);

  if (!sanitizedValue.includes("/?")) {
    return sanitizedValue;
  }

  const appNameWithDbMatch = sanitizedValue.match(
    /appName=([^&/]+)\/([^&]+)/,
  );

  if (!appNameWithDbMatch) {
    return sanitizedValue;
  }

  const [, appName, databaseName] = appNameWithDbMatch;

  return sanitizedValue
    .replace("/?", `/${databaseName}?`)
    .replace(`appName=${appName}/${databaseName}`, `appName=${appName}`);
};

export const getMongoUri = () => normalizeMongoUri(process.env.MONGODB_URI || "");

export const ensureDatabaseConnection = async () => {
  if (isDatabaseConnected()) {
    return mongoose.connection;
  }

  return connectDB();
};

export const connectDB = async () => {
  const mongoUri = getMongoUri();

  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    if (isDatabaseConnected()) {
      return mongoose.connection;
    }

    if (connectionPromise) {
      return connectionPromise;
    }

    if (mongoose.connection.readyState === DATABASE_CONNECTING_STATE) {
      connectionPromise = mongoose.connection
        .asPromise()
        .then(() => mongoose.connection)
        .catch((error) => {
          connectionPromise = null;
          throw error;
        });

      return connectionPromise;
    }

    if (mongoose.connection.readyState !== DATABASE_DISCONNECTED_STATE) {
      await mongoose.disconnect().catch(() => undefined);
    }

    connectionPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 20000,
      })
      .then(() => {
        console.log("MongoDB connected");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });

    return await connectionPromise;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
