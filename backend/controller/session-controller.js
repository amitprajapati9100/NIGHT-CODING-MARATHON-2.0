import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import { sendServerError } from "../utils/error-response-util.js";

const sessionPopulate = {
  path: "questions",
  options: { sort: { isPinned: -1, createdAt: 1 } },
};

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;
    const userId = req.user._id;
    const company = req.body.company?.trim() || "";

    if (!role?.trim() || !experience?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role and experience are required",
      });
    }

    const session = await Session.create({
      user: userId,
      role: role.trim(),
      experience: experience.trim(),
      company,
      topicsToFocus: topicsToFocus?.trim() || "",
      description: description?.trim() || "",
    });

    const incomingQuestions = Array.isArray(questions)
      ? questions.filter((item) => item?.question?.trim())
      : [];

    if (incomingQuestions.length > 0) {
      const questionDocs = await Promise.all(
        incomingQuestions.map(async (q) => {
          const question = await Question.create({
            session: session._id,
            question: q.question.trim(),
            answer: q.answer || "",
            note: q.note || "",
            isPinned: Boolean(q.isPinned),
          });
          return question._id;
        }),
      );

      session.questions = questionDocs;
      await session.save();
    }

    const populatedSession = await Session.findById(session._id).populate(
      sessionPopulate,
    );

    return res.status(201).json({
      success: true,
      session: populatedSession,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Server Error");
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ user: userId }).sort({
      createdAt: -1,
    });

    const formattedSessions = sessions.map((session) => ({
      ...session.toObject(),
      questionCount: session.questions.length,
    }));

    return res.status(200).json({
      success: true,
      count: formattedSessions.length,
      sessions: formattedSessions,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Server Error");
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate(sessionPopulate)
      .populate("user", "name email");

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    return res.status(200).json({
      success: true,
      session: {
        ...session.toObject(),
        questionCount: session.questions.length,
      },
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Server Error");
  }
};

