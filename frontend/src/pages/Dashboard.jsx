import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import SessionCard from "../components/SessionCard";
import SkeletonCard from "../components/SkeletonCard";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/useAuth";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { getErrorMessage } from "../utils/helpers";

const MotionDiv = motion.div;

const initialForm = {
  role: "",
  experience: "",
  company: "",
  topicsToFocus: "",
  description: "",
};

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pageError, setPageError] = useState("");
  const [createError, setCreateError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadSessions = async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.sessions || []);
    } catch (error) {
      setPageError(
        getErrorMessage(error, "We could not load your interview sessions."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSessions = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);

        if (isMounted) {
          setSessions(response.data.sessions || []);
          setPageError("");
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            getErrorMessage(
              error,
              "We could not load your interview sessions.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrapSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createSession = async (event) => {
    event.preventDefault();
    setCreateError("");

    if (!form.role.trim() || !form.experience.trim()) {
      setCreateError("Role and experience are required.");
      return;
    }

    setCreating(true);

    try {
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, form);
      const createdSession = {
        ...response.data.session,
        questionCount: response.data.session.questions?.length || 0,
      };

      setSessions((current) => [createdSession, ...current]);
      setForm(initialForm);
      toast.success("Session created. Start generating questions next.");
      navigate(`/interview/${createdSession._id}`);
    } catch (error) {
      setCreateError(
        getErrorMessage(error, "We could not create your session."),
      );
    } finally {
      setCreating(false);
    }
  };

  const totalQuestions = sessions.reduce(
    (count, session) => count + (session.questionCount || 0),
    0,
  );
  const latestSession = sessions[0];

  return (
    <AppShell
      title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
      subtitle="Create a focused interview session, generate technical questions, and keep your prep organized in one place."
      actions={
        latestSession ? (
          <button
            type="button"
            onClick={() => navigate(`/interview/${latestSession._id}`)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Resume Latest Session
            <FiArrowRight className="h-4 w-4" />
          </button>
        ) : null
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Sessions" value={sessions.length} accent="orange" />
        <StatCard label="Questions" value={totalQuestions} accent="cyan" />
        <StatCard
          label="Current Focus"
          value={latestSession?.role || "New Session"}
          accent="slate"
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <form
          onSubmit={createSession}
          className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Create Session
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Build a prep plan for your next interview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add role details and focus areas so the generated questions match the kind of interview you are preparing for.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Role
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleFormChange}
                placeholder="Frontend Developer"
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Experience
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleFormChange}
                placeholder="2 years"
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Target company
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleFormChange}
                placeholder="Product startup or Dream Company"
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Topics to focus on
              <input
                type="text"
                name="topicsToFocus"
                value={form.topicsToFocus}
                onChange={handleFormChange}
                placeholder="React, JavaScript, System Design"
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
            Session description
            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={handleFormChange}
              placeholder="Example: Preparing for React interviews with focus on state management, performance, hooks, and project-based answers."
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white"
            />
          </label>

          {createError ? (
            <p className="mt-4 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {createError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={creating}
            className="mt-6 rounded-full border border-slate-300 bg-transparent px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating Session..." : "Create Session"}
          </button>
        </form>

        <aside className="rounded-4xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
            Session Strategy
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            Better inputs create better practice questions.
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "Mention the exact role title you are applying for.",
              "Add focus topics like React hooks, Node APIs, SQL, DSA, or system design.",
              "Use the notes field to remind the AI what kind of projects or company style you expect.",
            ].map((tip) => (
              <div
                key={tip}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
              >
                {tip}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Your Sessions
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Continue from where you left off
            </h2>
          </div>
        </div>

        {pageError ? (
          <ErrorBanner
            title="Unable to load sessions"
            message={pageError}
            onRetry={loadSessions}
          />
        ) : null}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : pageError ? null : sessions.length === 0 ? (
          <EmptyState
            title="No sessions yet"
            description="Create your first interview prep session and we will turn it into a focused question bank."
            actionLabel="Create Your First Session"
            onGenerate={() =>
              document
                .querySelector("form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session, index) => (
              <MotionDiv
                key={session._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <SessionCard session={session} />
              </MotionDiv>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
};

export default Dashboard;
