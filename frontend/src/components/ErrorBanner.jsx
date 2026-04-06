import { MdRefresh } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";

const ErrorBanner = ({
  title = "Something went wrong",
  message,
  onRetry,
  actionLabel = "Try again",
}) => (
  <div className="flex items-start justify-between gap-4 rounded-3xl border border-red-200 bg-red-50/90 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <TbAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div>
        <p className="text-sm font-semibold text-red-700">{title}</p>
        <p className="mt-1 text-sm text-red-600">{message}</p>
      </div>
    </div>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-400 hover:text-red-700"
      >
        <MdRefresh className="h-4 w-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

export default ErrorBanner;
