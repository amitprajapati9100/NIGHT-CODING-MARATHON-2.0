import { AnimatePresence, motion } from "framer-motion";
import { useDeferredValue, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiFileText,
  FiSearch,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import GenerateButton from "../components/GenerateButton";
import MarkdownContent from "../components/MarkdownContent";
import QuestionCard from "../components/QuestionCard";
import SkeletonCard from "../components/SkeletonCard";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import {
  formatQuestionCount,
  getErrorMessage,
  sortQuestions,
} from "../utils/helpers";

const normalizeSession = (session) => ({
  ...session,
  questions: sortQuestions(session.questions || []),
});
const MotionDiv = motion.div;

const InterviewPrep = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pageError, setPageError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [savingQuestionId, setSavingQuestionId] = useState("");
  const [explainingId, setExplainingId] = useState("");
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const deferredQuery = useDeferredValue(searchQuery);

  const loadSession = async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(id));
      setSession(normalizeSession(response.data.session));
    } catch (error) {
      setPageError(
        getErrorMessage(error, "We could not load this interview session."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(id));

        if (isMounted) {
          setSession(normalizeSession(response.data.session));
          setPageError("");
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            getErrorMessage(
              error,
              "We could not load this interview session.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const generateQuestions = async (force = false) => {
    setGenerating(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          sessionId: id,
          force,
        },
        {
          timeout: 30000,
        },
      );

      if (response.data.session) {
        setSession(normalizeSession(response.data.session));
      } else {
        await loadSession();
      }

      toast.success(force ? "Questions regenerated." : "Questions generated.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "We could not generate interview questions."),
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateQuestionLocally = (updatedQuestion) => {
    setSession((current) => {
      if (!current) return current;

      return normalizeSession({
        ...current,
        questions: current.questions.map((item) =>
          item._id === updatedQuestion._id ? { ...item, ...updatedQuestion } : item,
        ),
      });
    });
  };

  const patchQuestion = async (question, updates, successMessage) => {
    setSavingQuestionId(question._id);

    try {
      const response = await axiosInstance.patch(
        API_PATHS.QUESTION.UPDATE(question._id),
        updates,
      );
      updateQuestionLocally(response.data.question);
      toast.success(successMessage);
    } catch (error) {
      toast.error(getErrorMessage(error, "We could not save that change."));
    } finally {
      setSavingQuestionId("");
    }
  };

  const handleExplain = async (question) => {
    if (question.explanation) {
      setSelectedExplanation({
        question: question.question,
        title: question.explanationTitle || "Deep Dive",
        explanation: question.explanation,
      });
      return;
    }

    setExplainingId(question._id);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.EXPLAIN,
        {
          questionId: question._id,
        },
        {
          timeout: 30000,
        },
      );

      const explanation = response.data.data;
      updateQuestionLocally({
        ...question,
        explanation: explanation.explanation,
        explanationTitle: explanation.title,
      });
      setSelectedExplanation({
        question: question.question,
        ...explanation,
      });
      toast.success("Explanation ready.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "We could not generate the explanation."),
      );
    } finally {
      setExplainingId("");
    }
  };

  const questions = session?.questions || [];
  const visibleQuestions = questions.filter((question) => {
    const query = deferredQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      question.question.toLowerCase().includes(query) ||
      (question.answer || "").toLowerCase().includes(query) ||
      question.note?.toLowerCase().includes(query)
    );
  });
  const pinnedCount = questions.filter((question) => question.isPinned).length;

  return (
    <AppShell
      title={session ? `${session.role} Interview Workspace` : "Interview Workspace"}
      subtitle={
        session
          ? `Role: ${session.role} | Experience: ${session.experience}${
              session.company ? ` | Company: ${session.company}` : ""
            }`
          : "Practice the questions for this session, save your notes, and ask for deeper explanations whenever you need them."
      }
      actions={
        <>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            <FiArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <GenerateButton
            onClick={() => generateQuestions(Boolean(questions.length))}
            generating={generating}
            loading={loading}
            label={questions.length ? "Regenerate Questions" : "Generate Questions"}
            busyLabel={
              questions.length ? "Regenerating Questions" : "Generating Questions"
            }
          />
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Question Bank
          </p>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {formatQuestionCount(questions.length)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Pinned Topics
          </p>
          <p className="mt-4 text-3xl font-bold text-slate-900">{pinnedCount}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Focus Area
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {session?.topicsToFocus ||
              session?.description ||
              "General interview practice for this role."}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Study Flow
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Review answers, save your own notes, and search instantly
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use search to filter by concepts, pin the questions you want to repeat, and open explanations whenever you need a deeper breakdown.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
            <FiSearch className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search questions, answers, or notes"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </section>

      <section className="mt-8">
        {pageError ? (
          <ErrorBanner
            title="Unable to load interview questions"
            message={pageError}
            onRetry={loadSession}
          />
        ) : null}

        {loading ? (
          <div className="grid gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : pageError ? null : questions.length === 0 ? (
          <EmptyState
            title="No questions generated yet"
            description="Create a first set of tailored interview questions for this session and start building your notes."
            onGenerate={() => generateQuestions(false)}
            generating={generating}
          />
        ) : visibleQuestions.length === 0 ? (
          <EmptyState
            title="No search results"
            description="Try a different keyword or clear the search box to view all questions in this session."
          />
        ) : (
          <AnimatePresence>
            <div className="grid gap-5">
              {visibleQuestions.map((question, index) => (
                <MotionDiv
                  key={`${question._id}-${question.updatedAt || ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <QuestionCard
                    question={question}
                    saving={savingQuestionId === question._id}
                    explaining={explainingId === question._id}
                    onTogglePin={(currentQuestion) =>
                      patchQuestion(
                        currentQuestion,
                        { isPinned: !currentQuestion.isPinned },
                        currentQuestion.isPinned
                          ? "Question removed from pinned."
                          : "Question pinned for revision.",
                      )
                    }
                    onSaveNote={(currentQuestion, note) =>
                      patchQuestion(
                        currentQuestion,
                        { note },
                        "Your note has been saved.",
                      )
                    }
                    onExplain={handleExplain}
                  />
                </MotionDiv>
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>

      <AnimatePresence>
        {selectedExplanation ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-4 py-8"
          >
            <MotionDiv
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-white/20 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                    <FiZap className="h-4 w-4" />
                    AI Explanation
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    {selectedExplanation.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {selectedExplanation.question}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExplanation(null)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-6">
                <div className="mb-5 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                    <FiFileText className="h-4 w-4 text-orange-500" />
                    Concept breakdown
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                    <FiStar className="h-4 w-4 text-orange-500" />
                    Saved for this question
                  </div>
                </div>

                <MarkdownContent content={selectedExplanation.explanation} />
              </div>
            </MotionDiv>
          </MotionDiv>
        ) : null}
      </AnimatePresence>
    </AppShell>
  );
};

export default InterviewPrep;
