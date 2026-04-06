import Question from "../models/question-model.js";
import { sendServerError } from "../utils/error-response-util.js";

const editableFields = ["answer", "isPinned", "note"];

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate({
      path: "session",
      select: "user",
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (question.session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    editableFields.forEach((field) => {
      if (field in req.body) {
        question[field] = req.body[field];
      }
    });

    await question.save();

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Failed to update question");
  }
};
