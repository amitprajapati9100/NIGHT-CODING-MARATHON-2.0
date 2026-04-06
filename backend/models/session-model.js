// session role -> mern full stack, java full stack ,frontend
// exp => 2, 1, 10
// userId => this will store ref

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    topicsToFocus: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true, bufferCommands: false },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
