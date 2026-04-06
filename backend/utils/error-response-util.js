const MISSING_MONGODB_URI_MESSAGE = "MONGODB_URI is missing in backend/.env";
const DATABASE_UNAVAILABLE_MESSAGE =
  "Database connection is unavailable. Add a working MONGODB_URI in backend/.env and restart the backend.";

export const isDuplicateKeyError = (error) =>
  error?.code === 11000 || /duplicate key error/i.test(error?.message || "");

export const isValidationError = (error) =>
  error?.name === "ValidationError" || error?.name === "CastError";

export const isDatabaseError = (error) =>
  error?.message === MISSING_MONGODB_URI_MESSAGE ||
  error?.name === "MongoServerSelectionError" ||
  /before initial connection is complete/i.test(error?.message || "") ||
  /buffering timed out/i.test(error?.message || "") ||
  /topology was destroyed/i.test(error?.message || "");

export const getDatabaseErrorMessage = (error) =>
  error?.message === MISSING_MONGODB_URI_MESSAGE
    ? "MONGODB_URI is missing in backend/.env. Add your MongoDB connection string and restart the backend."
    : DATABASE_UNAVAILABLE_MESSAGE;

export const sendServerError = (
  res,
  error,
  fallbackMessage = "Internal server error",
) => {
  if (isDatabaseError(error)) {
    return res.status(503).json({
      success: false,
      message: getDatabaseErrorMessage(error),
    });
  }

  if (isDuplicateKeyError(error)) {
    const duplicatedFields = Object.keys(error?.keyPattern || error?.keyValue || {});
    const duplicatedFieldLabel = duplicatedFields[0] || "field";

    return res.status(400).json({
      success: false,
      message:
        duplicatedFieldLabel === "email"
          ? "An account with this email already exists."
          : `${duplicatedFieldLabel} already exists.`,
      error: error.message,
    });
  }

  if (isValidationError(error)) {
    const validationMessage =
      Object.values(error?.errors || {})
        .map((item) => item?.message)
        .find(Boolean) || error.message || "Invalid request data";

    return res.status(400).json({
      success: false,
      message: validationMessage,
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
    error: error.message,
  });
};
