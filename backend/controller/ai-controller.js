import "../config/env-config.js";

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  regenerateAnswerPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";
import { sendServerError } from "../utils/error-response-util.js";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;
const QUESTION_COUNT = 10;
const DEFAULT_AI_TIMEOUT_MS = 15000;
const parsedAiTimeout = Number.parseInt(process.env.AI_REQUEST_TIMEOUT_MS, 10);
const AI_REQUEST_TIMEOUT_MS =
  Number.isFinite(parsedAiTimeout) && parsedAiTimeout > 0
    ? parsedAiTimeout
    : DEFAULT_AI_TIMEOUT_MS;
const RECENT_SIGNAL_LIMIT = 25;

const sessionPopulate = {
  path: "questions",
  options: { sort: { isPinned: -1, createdAt: 1 } },
};

const inferTopics = (session) => {
  const providedTopics = session.topicsToFocus
    ?.split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);

  if (providedTopics?.length) {
    return providedTopics;
  }

  const role = `${session.role} ${session.description} ${session.company}`
    .toLowerCase()
    .trim();

  if (role.includes("frontend") || role.includes("react")) {
    return [
      "React component design",
      "State management",
      "Performance optimization",
      "Accessibility",
      "Testing strategy",
      "JavaScript fundamentals",
    ];
  }

  if (
    role.includes("backend") ||
    role.includes("node") ||
    role.includes("api")
  ) {
    return [
      "REST API design",
      "Authentication and authorization",
      "Database modeling",
      "Caching strategy",
      "Scalability",
      "Error handling",
    ];
  }

  if (role.includes("full stack")) {
    return [
      "System design",
      "API integration",
      "Database modeling",
      "React architecture",
      "Deployment",
      "Debugging production issues",
    ];
  }

  return [
    "Core fundamentals",
    "Project architecture",
    "Problem solving",
    "Performance",
    "Testing",
    "Collaboration",
  ];
};

const getDifficultyLabel = (experience) => {
  const years = Number.parseFloat(`${experience}`.match(/\d+(\.\d+)?/)?.[0]);

  if (Number.isNaN(years)) return "mid-level";
  if (years < 1) return "entry-level";
  if (years < 3) return "junior-to-mid";
  if (years < 6) return "mid-to-senior";
  return "senior";
};

const cleanGeneratedAnswer = (answer = "") =>
  answer
    .replace(/\*\*How to answer well:\*\*[\s\S]*?(?=\n\s*```|$)/gi, "")
    .replace(/How to answer well:[\s\S]*?(?=\n\s*```|$)/gi, "")
    .replace(
      /```(?:js|javascript)?\s*const result = items\.filter\(Boolean\)\.map\(\(item\) => item\.trim\(\)\);\s*```/gi,
      "",
    )
    .replace(
      /const result = items\.filter\(Boolean\)\.map\(\(item\) => item\.trim\(\)\);/gi,
      "",
    )
    .trim();

const buildRequirementContext = (session) => {
  const parts = [];
  if (session.role) parts.push(`Role: ${session.role}`);
  if (session.experience) parts.push(`Experience: ${session.experience}`);
  if (session.company) parts.push(`Target: ${session.company}`);
  if (session.topicsToFocus) parts.push(`Focus: ${session.topicsToFocus}`);
  return parts.join(" | ");
};

const enforceAnswerQuality = (session, question, answer) => {
  const sanitized = cleanGeneratedAnswer(answer);
  const lower = sanitized.toLowerCase();
  const hasDirect = lower.includes("**direct answer:**");
  const hasPractical = lower.includes("**practical example:**");
  const hasTradeoff = lower.includes("**trade-off / lesson:**");

  if (hasDirect && hasPractical && hasTradeoff) {
    return sanitized;
  }

  const requirement = buildRequirementContext(session);
  return [
    `**Direct Answer:** ${question} should be answered in the context of ${session.role}. Focus on what you built, why you chose that approach, and the measurable impact.`,
    "",
    `**Practical Example:** In a ${session.role} project (${requirement}), explain one real implementation or debugging case. Mention the issue, the steps you took, and the result.`,
    "",
    "**Trade-off / Lesson:** State one alternative you considered and why your final choice was better for performance, maintainability, or delivery speed.",
  ].join("\n");
};

const toTitleCase = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

const buildFallbackAnswer = (session, topic) => {
  const difficulty = getDifficultyLabel(session.experience);

  return [
    `**Direct Answer:** ${topic} is important for strong ${session.role} solutions, especially at a ${difficulty} level interview.`,
    "",
    `**Practical Example:** Explain one real project where you used ${topic}, what challenge appeared, and how your final implementation solved it.`,
    "",
    "**Trade-off / Lesson:** Mention one alternative approach and why your chosen path was better for reliability, performance, or maintainability.",
  ].join("\n");
};

const generateFallbackQuestions = (session, count) => {
  const topics = inferTopics(session);
  const prompts = [
    (topic) =>
      `How would you explain ${topic} in the context of a ${session.role} project?`,
    (topic) =>
      `What common mistakes do teams make with ${topic}, and how would you avoid them?`,
    (topic) =>
      `Describe a real debugging approach you would use when ${topic} goes wrong in production.`,
    (topic) =>
      `What trade-offs would you discuss when making architecture decisions around ${topic}?`,
    (topic) =>
      `How would you turn ${topic} into a strong interview answer based on one of your projects?`,
  ];

  const generated = [];

  for (let index = 0; index < count; index += 1) {
    const topic = topics[index % topics.length];
    const buildQuestion = prompts[index % prompts.length];

    generated.push({
      question: buildQuestion(topic),
      answer: buildFallbackAnswer(session, topic),
    });
  }

  return generated;
};

const safeJsonParse = (rawText, matcher) => {
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .replace(/^json\s*/i, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    const jsonMatch = cleanedText.match(matcher);

    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }

    return JSON.parse(jsonMatch[0]);
  }
};

const withTimeout = (promise, timeoutMs, timeoutMessage) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });

const normalizeQuestions = (questions, session) =>
  questions
    .filter((item) => item?.question)
    .map((item) => ({
      question: item.question.trim(),
      answer:
        typeof item.answer === "string" && item.answer.trim()
          ? enforceAnswerQuality(session, item.question.trim(), item.answer.trim())
          : enforceAnswerQuality(
              session,
              item.question.trim(),
              "**Direct Answer:** Share a practical answer with an example from your work.",
            ),
    }));

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRecentInterviewSignals = async (session) => {
  const filters = [];
  const role = session.role?.trim();
  const company = session.company?.trim();
  const topics = session.topicsToFocus
    ?.split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);

  if (role) {
    filters.push({
      "session.role": { $regex: escapeRegExp(role), $options: "i" },
    });
  }

  if (company) {
    filters.push({
      "session.company": { $regex: escapeRegExp(company), $options: "i" },
    });
  }

  if (topics?.length) {
    filters.push({
      "session.topicsToFocus": {
        $regex: escapeRegExp(topics[0]),
        $options: "i",
      },
    });
  }

  const matchStage = filters.length ? { $or: filters } : {};

  const recent = await Question.aggregate([
    {
      $lookup: {
        from: "sessions",
        localField: "session",
        foreignField: "_id",
        as: "session",
      },
    },
    { $unwind: "$session" },
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $limit: RECENT_SIGNAL_LIMIT },
    {
      $project: {
        question: 1,
      },
    },
  ]);

  if (!recent.length) return "";

  return recent
    .map((item, index) => `${index + 1}. ${item.question}`)
    .join("\n");
};

const generateQuestionsWithGemini = async (session, count) => {
  if (!ai) {
    throw new Error("Gemini API key is not configured");
  }

  const recentContext = await buildRecentInterviewSignals(session);
  const prompt = questionAnswerPrompt(
    session.role,
    session.experience,
    session.topicsToFocus,
    session.description,
    session.company,
    count,
    recentContext,
  );

  const response = await withTimeout(
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    }),
    AI_REQUEST_TIMEOUT_MS,
    "Gemini question generation timed out",
  );

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const rawText = parts
    .filter((part) => !part.thought)
    .map((part) => part.text ?? "")
    .join("");

  const parsed = safeJsonParse(rawText, /\[[\s\S]*\]/);
  const normalizedQuestions = normalizeQuestions(parsed, session);

  if (!normalizedQuestions.length) {
    throw new Error("AI did not return any valid questions");
  }

  return normalizedQuestions;
};

const getOwnedSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    return { error: { status: 404, message: "Session not found" } };
  }

  if (session.user.toString() !== userId.toString()) {
    return { error: { status: 403, message: "Not authorized" } };
  }

  return { session };
};

const replaceSessionQuestions = async (session, questions) => {
  await Question.deleteMany({ session: session._id });

  const savedQuestions = await Question.insertMany(
    questions.map((item) => ({
      session: session._id,
      question: item.question,
      answer: item.answer,
      note: "",
      isPinned: false,
    })),
  );

  session.questions = savedQuestions.map((item) => item._id);
  await session.save();

  return savedQuestions;
};

const buildFallbackExplanation = (question) => {
  const shortTitle = question
    .replace(/[^\w\s]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 5)
    .join(" ");

  return {
    title: toTitleCase(shortTitle || "Interview Concept"),
    explanation: [
      `**Definition:** ${question} is testing whether you understand the underlying concept and can connect it to practical decisions.`,
      "",
      "A strong answer should move from definition to implementation. Start by explaining the concept clearly, then describe where it appears in real work, and finally mention one trade-off or pitfall.",
      "",
      "Interviewers usually care about three things:",
      "- Whether you understand the concept, not just the buzzword.",
      "- Whether you can apply it inside a project or production issue.",
      "- Whether you can explain trade-offs and good engineering judgment.",
      "",
      "```js\nconst example = {\n  concept: 'clear explanation',\n  project: 'real example',\n  tradeoff: 'why this approach was chosen',\n};\n```",
      "",
      "**Key Takeaway:** Pair a clean definition with a real project example and one thoughtful trade-off.",
    ].join("\n"),
  };
};

const generateExplanationWithGemini = async (question) => {
  if (!ai) {
    throw new Error("Gemini API key is not configured");
  }

  const prompt = conceptExplainPrompt(question);
  const response = await withTimeout(
    ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    }),
    AI_REQUEST_TIMEOUT_MS,
    "Gemini explanation generation timed out",
  );

  const rawText = response.text || "";
  const parsed = safeJsonParse(rawText, /\{[\s\S]*\}/);

  if (!parsed.title || !parsed.explanation) {
    throw new Error("Response missing required fields");
  }

  return parsed;
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const {
      sessionId,
      count = QUESTION_COUNT,
      force = false,
    } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    const ownedSession = await getOwnedSession(sessionId, req.user._id);
    if (ownedSession.error) {
      return res.status(ownedSession.error.status).json({
        success: false,
        message: ownedSession.error.message,
      });
    }

    const { session } = ownedSession;
    const existingQuestions = await Question.find({ session: session._id }).sort({
      isPinned: -1,
      createdAt: 1,
    });

    if (existingQuestions.length > 0 && !force) {
      return res.status(200).json({
        success: true,
        source: "existing",
        data: existingQuestions,
      });
    }

    let generatedQuestions;
    let source = "fallback";
    try {
      generatedQuestions = await generateQuestionsWithGemini(session, count);
      source = "gemini";
    } catch (error) {
      if (ai) {
        console.warn("Falling back to local question generation:", error.message);
      }
      generatedQuestions = generateFallbackQuestions(session, count);
    }

    const saved = await replaceSessionQuestions(session, generatedQuestions);
    const hydratedSession = await Session.findById(session._id).populate(
      sessionPopulate,
    );

    return res.status(201).json({
      success: true,
      source,
      data: saved,
      session: hydratedSession,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Failed to generate questions");
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question, questionId } = req.body;
    let requestedQuestion = question?.trim();
    let questionDoc = null;

    if (questionId) {
      questionDoc = await Question.findById(questionId).populate({
        path: "session",
        select: "user",
      });

      if (!questionDoc) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      if (questionDoc.session.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      requestedQuestion = requestedQuestion || questionDoc.question;
    }

    if (!requestedQuestion) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    let explanation;
    let source = "fallback";
    try {
      explanation = await generateExplanationWithGemini(requestedQuestion);
      source = "gemini";
    } catch (error) {
      if (ai) {
        console.warn(
          "Falling back to local explanation generation:",
          error.message,
        );
      }
      explanation = buildFallbackExplanation(requestedQuestion);
    }

    if (questionDoc) {
      questionDoc.explanationTitle = explanation.title;
      questionDoc.explanation = explanation.explanation;
      await questionDoc.save();
    }

    return res.status(200).json({
      success: true,
      source,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Failed to generate explanation");
  }
};

// @desc    Regenerate answer for one interview question using user guidance
// @route   POST /api/ai/regenerate-answer
// @access  Private
export const regenerateQuestionAnswer = async (req, res) => {
  try {
    const { questionId, userInput = "" } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "questionId is required",
      });
    }

    const questionDoc = await Question.findById(questionId).populate({
      path: "session",
      select: "user role experience company topicsToFocus description",
    });

    if (!questionDoc) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (questionDoc.session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    let nextAnswer = "";
    let source = "fallback";
    const session = questionDoc.session;

    try {
      if (!ai) {
        throw new Error("Gemini API key is not configured");
      }

      const prompt = regenerateAnswerPrompt({
        role: session.role,
        experience: session.experience,
        company: session.company,
        topicsToFocus: session.topicsToFocus,
        description: session.description,
        question: questionDoc.question,
        userInput,
      });

      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        }),
        AI_REQUEST_TIMEOUT_MS,
        "Gemini answer regeneration timed out",
      );

      const rawText = response.text || "";
      const parsed = safeJsonParse(rawText, /\{[\s\S]*\}/);
      if (!parsed?.answer || typeof parsed.answer !== "string") {
        throw new Error("Invalid regenerated answer");
      }

      nextAnswer = enforceAnswerQuality(
        session,
        questionDoc.question,
        parsed.answer.trim(),
      );
      source = "gemini";
    } catch (error) {
      if (ai) {
        console.warn("Falling back to local answer regeneration:", error.message);
      }
      nextAnswer = enforceAnswerQuality(
        session,
        questionDoc.question,
        [
          `**Direct Answer:** ${questionDoc.question} should be answered for a ${session.role} role by focusing on exactly what you implemented and why.`,
          "",
          `**Practical Example:** ${userInput || "Use a recent project where you solved this in production. Mention issue, fix, and measurable outcome."}`,
          "",
          "**Trade-off / Lesson:** Mention one alternative, why you did not choose it, and the lesson for future systems.",
        ].join("\n"),
      );
    }

    questionDoc.answer = nextAnswer;
    await questionDoc.save();

    return res.status(200).json({
      success: true,
      source,
      question: questionDoc,
    });
  } catch (error) {
    console.error(error);
    return sendServerError(res, error, "Failed to regenerate answer");
  }
};
