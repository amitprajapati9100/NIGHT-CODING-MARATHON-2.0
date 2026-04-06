import { BsLightningChargeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";

const GenerateButton = ({
  onClick,
  generating,
  loading,
  label = "Generate Questions",
  busyLabel = "Generating Questions",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={generating || loading}
    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-transparent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
  >
    {generating ? (
      <>
        <ImSpinner8 className="h-4 w-4 animate-spin" />
        {busyLabel}
      </>
    ) : (
      <>
        <BsLightningChargeFill className="h-4 w-4" />
        {label}
      </>
    )}
  </button>
);

export default GenerateButton;
