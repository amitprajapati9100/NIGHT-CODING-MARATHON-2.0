import { motion } from "framer-motion";
import { FiArrowRight, FiLayers, FiMessageSquare, FiTarget } from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionSection = motion.section;

const features = [
  {
    title: "Targeted question sets",
    description:
      "Generate interview questions based on role, experience, company, and your focus topics.",
    icon: FiTarget,
  },
  {
    title: "AI concept breakdowns",
    description:
      "Open any question, review the answer, and ask for a deeper explanation when you need it.",
    icon: FiMessageSquare,
  },
  {
    title: "Personal prep workspace",
    description:
      "Pin important questions, add your own notes, and build a practice deck for revision.",
    icon: FiLayers,
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f3ec] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] -top-48 h-112 w-md rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute -bottom-48 right-[-10%] h-104 w-104 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Interview Prep
              </p>
              <p className="text-sm text-slate-500">
                Responsive practice for real job interviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="rounded-full border border-slate-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
            >
              {isAuthenticated ? "Continue Prep" : "Get Started"}
            </Link>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-16">
          <section>
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-600"
            >
              Build confidence before the interview room
            </MotionDiv>

            <MotionH1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 max-w-3xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl"
            >
              Practice smarter with an AI interview coach tuned to your role.
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            >
              Create a session for frontend, backend, full stack, Java, MERN, or any role you are targeting.
              Generate tailored questions, review polished answers, and save the points you want to say in your own words.
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Start Preparing
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="rounded-full border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                View Workspace
              </Link>
            </MotionDiv>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["10+", "question prompts per session"],
                ["1-click", "AI explanations for hard concepts"],
                ["mobile-ready", "responsive layout across devices"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur"
                >
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="mt-2 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <MotionSection
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[2.5rem] border border-white/60 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/20"
          >
            <div className="rounded-4xl border border-white/10 bg-white/6 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
                What you can do
              </p>
              <div className="mt-6 space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <MotionDiv
                      key={feature.title}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
                      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400 text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {feature.description}
                      </p>
                    </MotionDiv>
                  );
                })}
              </div>
            </div>
          </MotionSection>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
