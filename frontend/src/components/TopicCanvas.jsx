import { useEffect, useMemo, useRef } from "react";

const cleanText = (value = "") =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_#>`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractPoints = (explanation = "") => {
  const fromBullets = explanation
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => cleanText(line.replace(/^[-*]\s+/, "")));

  if (fromBullets.length >= 3) {
    return fromBullets.slice(0, 4);
  }

  const fromSentences = cleanText(explanation)
    .split(".")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length > 24)
    .slice(0, 4);

  return fromSentences.length
    ? fromSentences
    : [
        "Define the concept in plain language",
        "Share one practical project example",
        "Mention a trade-off or lesson learned",
      ];
};

const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);

  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
};

const TopicCanvas = ({ title = "Topic", question = "", explanation = "" }) => {
  const canvasRef = useRef(null);
  const points = useMemo(() => extractPoints(explanation), [explanation]);
  const centerLabel = useMemo(() => cleanText(title || question).slice(0, 36), [title, question]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const draw = () => {
      const container = canvas.parentElement;
      const width = Math.max(320, container?.clientWidth || 320);
      const height = 280;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = 54;

      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 13px Urbanist, sans-serif";
      ctx.textAlign = "center";
      wrapText(ctx, centerLabel || "Concept", cx, cy - 8, 86, 15, 3);

      const orbitRadius = 108;
      points.slice(0, 4).forEach((point, index, list) => {
        const angle = ((Math.PI * 2) / list.length) * index - Math.PI / 2;
        const px = cx + orbitRadius * Math.cos(angle);
        const py = cy + orbitRadius * Math.sin(angle);

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.lineTo(px, py);
        ctx.stroke();

        const boxW = 140;
        const boxH = 52;
        const bx = px - boxW / 2;
        const by = py - boxH / 2;

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "600 11px Urbanist, sans-serif";
        ctx.textAlign = "left";
        wrapText(ctx, point, bx + 10, by + 20, boxW - 20, 13, 3);
      });
    };

    draw();
    const observer = new ResizeObserver(() => draw());
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [centerLabel, points]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
        Canvas View
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Visual map of the core concept and key talking points.
      </p>
      <canvas ref={canvasRef} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white" />
    </section>
  );
};

export default TopicCanvas;
