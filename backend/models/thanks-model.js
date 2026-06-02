import mongoose from "mongoose";

const thanksSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "Thanks for helping me prepare better.",
    },
  },
  { timestamps: true, bufferCommands: false },
);

const Thanks = mongoose.model("Thanks", thanksSchema);

export default Thanks;
