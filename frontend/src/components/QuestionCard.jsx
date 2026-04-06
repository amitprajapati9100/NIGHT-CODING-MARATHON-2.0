import { useState } from "react";
import {
  FiBookmark,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiLoader,
  FiZap,
} from "react-icons/fi";

import MarkdownContent from "./MarkdownContent";

const QuestionCard = ({
  question,
  saving,
  explaining,
  onTogglePin,
  onSaveNote,
  onExplain,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(question.note || "");

  return (
    <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {question.isPinned ? (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                Important
              </span>
            ) : null}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Interview Question
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {question.question}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Expand to review the answer, save your own note, and generate a deeper explanation.
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FiChevronDown
                className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onTogglePin(question)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              question.isPinned
                ? "border-orange-300 bg-orange-50 text-orange-600"
                : "border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            <FiBookmark className="h-4 w-4" />
            {question.isPinned ? "Pinned" : "Pin"}
          </button>

          <button
            type="button"
            onClick={() => onExplain(question)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            {explaining ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
              <FiZap className="h-4 w-4" />
            )}
            Explain
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
          <div className="rounded-[1.75rem] bg-slate-50 p-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              <FiBookOpen className="h-4 w-4 text-orange-500" />
              Model Answer
            </div>
            <MarkdownContent content={question.answer || "No answer generated yet."} />
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Your Notes
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Save a personal answer outline, project example, or quick revision bullets.
            </p>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={8}
              className="mt-4 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
              placeholder="Write how you would answer this in the interview..."
            />

            <button
              type="button"
              onClick={() => onSaveNote(question, note)}
              disabled={saving}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiCheck className="h-4 w-4" />
              )}
              Save Note
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
};

export default QuestionCard;
