import { BsLightningChargeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { TbBulb } from "react-icons/tb";

const EmptyState = ({
  title = "Nothing here yet",
  description = "Create or generate content to get started.",
  actionLabel = "Generate Questions",
  onGenerate,
  generating = false,
}) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-4xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm">
    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100">
      <TbBulb className="h-8 w-8 text-orange-500" />
    </div>
    <div>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
    {onGenerate && (
      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generating ? (
          <>
            <ImSpinner8 className="h-4 w-4 animate-spin" />
            Generating
          </>
        ) : (
          <>
            <BsLightningChargeFill className="h-4 w-4" />
            {actionLabel}
          </>
        )}
      </button>
    )}
  </div>
);

export default EmptyState;
