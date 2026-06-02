import { memo, useState } from "react";
import {
  FiBookmark,
  FiCheck,
  FiChevronDown,
  FiLoader,
  FiZap,
} from "react-icons/fi";

import MarkdownContent from "./MarkdownContent";
import { getSummary, sanitizeAnswer } from "../utils/helpers";

const QuestionCard = ({
  question,
  saving,
  explaining,
  regenerating,
  onTogglePin,
  onSaveNote,
  onExplain,
  onRegenerateAnswer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(question.note || "");
  const [regenInput, setRegenInput] = useState("");
  const answerContent = sanitizeAnswer(question.answer || "");

  return (
    <article className="rounded-3xl border border-emerald-100 bg-[#e8f5eb] p-4 shadow-sm">
      <div className="mb-4 flex justify-end">
        <div className="max-w-[90%] rounded-2xl rounded-br-md border border-emerald-300 bg-emerald-500 px-4 py-3 text-white">
          <div className="mb-2 flex items-center gap-2">
            {question.isPinned ? (
              <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Important
              </span>
            ) : null}
            <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
              You
            </span>
          </div>
          <h3 className="text-base font-semibold leading-6">{question.question}</h3>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="max-w-[94%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-left"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600">
              AI
            </span>
            <FiChevronDown className={`h-4 w-4 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
          </div>
          {isOpen ? (
            <MarkdownContent content={answerContent || "No answer generated yet."} />
          ) : (
            <p className="text-sm leading-6 text-slate-700">{getSummary(answerContent)}</p>
          )}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onTogglePin(question)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            question.isPinned
              ? "border-orange-300 bg-orange-50 text-orange-600"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
          }`}
        >
          <FiBookmark className="h-4 w-4" />
          {question.isPinned ? "Pinned" : "Pin"}
        </button>

        <button
          type="button"
          onClick={() => onExplain(question)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
        >
          {explaining ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiZap className="h-4 w-4" />}
          Explain
        </button>
      </div>

      {isOpen ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">Regenerate Answer</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your requirement and generate a better answer for this question.
          </p>
          <textarea
            value={regenInput}
            onChange={(event) => setRegenInput(event.target.value)}
            rows={3}
            className="mt-4 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white"
            placeholder="Example: Focus on React performance with one real production bug fix."
          />
          <button
            type="button"
            onClick={() => onRegenerateAnswer(question, regenInput)}
            disabled={regenerating}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {regenerating ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiZap className="h-4 w-4" />}
            Regenerate Answer
          </button>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">Your Notes</p>
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
            {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiCheck className="h-4 w-4" />}
            Save Note
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default memo(QuestionCard);
