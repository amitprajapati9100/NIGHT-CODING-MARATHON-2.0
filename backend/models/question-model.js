import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    question: { type: String, required: true, trim: true },
    answer: { type: String, default: "" },
    note: { type: String, default: "" },
    isPinned: { type: Boolean, default: false },
    explanationTitle: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { timestamps: true, bufferCommands: false },
);

const Question = mongoose.model("Question", questionsSchema);

export default Question;
