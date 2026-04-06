import { Link } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiClock, FiTarget } from "react-icons/fi";

import { formatDate, formatQuestionCount } from "../utils/helpers";

const SessionCard = ({ session }) => (
  <Link
    to={`/interview/${session._id}`}
    className="group flex h-full flex-col rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/8"
  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
        <FiBriefcase className="h-5 w-5" />
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
        {formatDate(session.createdAt)}
      </span>
    </div>

    <div className="space-y-3">
      <div>
        <p className="text-xl font-semibold text-slate-900">{session.role}</p>
        <p className="mt-1 text-sm text-slate-500">
          {session.company || "General interview preparation"}
        </p>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
        {session.description ||
          session.topicsToFocus ||
          "No session notes yet. Open this session to generate tailored questions."}
      </p>
    </div>

    <div className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2">
          <FiClock className="h-4 w-4 text-orange-500" />
          Experience
        </span>
        <span className="font-semibold text-slate-900">{session.experience}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2">
          <FiTarget className="h-4 w-4 text-orange-500" />
          Coverage
        </span>
        <span className="font-semibold text-slate-900">
          {formatQuestionCount(session.questionCount)}
        </span>
      </div>
    </div>

    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
      Open Session
      <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </div>
  </Link>
);

export default SessionCard;
