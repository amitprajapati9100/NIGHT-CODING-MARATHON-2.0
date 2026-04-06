import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownContent = ({ content }) => (
  <div className="prose prose-slate max-w-none prose-p:leading-7 prose-pre:rounded-2xl prose-pre:bg-slate-900 prose-pre:p-4 prose-code:text-orange-600 prose-strong:text-slate-900">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          if (inline) {
            return (
              <code
                className={`rounded bg-orange-100 px-1.5 py-0.5 text-sm ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <pre className="overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;
