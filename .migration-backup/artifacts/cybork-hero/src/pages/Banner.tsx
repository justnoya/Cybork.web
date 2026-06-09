import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Loader2 } from "lucide-react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

const CHARSET = " .':;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function drawASCIIFrame(
  canvas: HTMLCanvasElement,
  t: number,
  charSize: number,
  textSize: number
) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "rgb(8,8,10)";
  ctx.fillRect(0, 0, W, H);

  const cols = Math.floor(W / charSize);
  const rows = Math.floor(H / charSize);

  const off = document.createElement("canvas");
  off.width = cols;
  off.height = rows;
  const offCtx = off.getContext("2d")!;

  offCtx.fillStyle = "rgb(8,8,10)";
  offCtx.fillRect(0, 0, cols, rows);
  offCtx.fillStyle = "#ffffff";

  let fontSize = textSize;
  offCtx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  while (offCtx.measureText("CYBORK").width > cols * 0.92 && fontSize > 4) {
    fontSize -= 1;
    offCtx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  }

  offCtx.textBaseline = "middle";
  offCtx.textAlign = "center";
  offCtx.fillText("CYBORK", cols / 2, rows / 2);

  const img = offCtx.getImageData(0, 0, cols, rows).data;

  ctx.font = `${charSize}px "Space Mono", monospace`;
  ctx.textBaseline = "top";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = (row * cols + col) * 4;
      const brightness = img[i] / 255;
      if (brightness < 0.05) continue;

      const wave = Math.sin(t * 2.5 + col * 0.18 + row * 0.3) * 0.3 +
                   Math.cos(t * 1.8 + row * 0.22) * 0.2;
      const b = Math.min(1, brightness + wave * brightness);
      const charIdx = Math.floor(b * (CHARSET.length - 1));
      const ch = CHARSET[charIdx] || ".";

      const r = Math.round(56 + b * (180 - 56));
      const g = Math.round(59 + b * (186 - 59));
      const bv = Math.round(67 + b * (200 - 67));
      ctx.fillStyle = `rgb(${r},${g},${bv})`;
      ctx.fillText(ch, col * charSize, row * charSize);
    }
  }

  const cornerSize = 10;
  const cornerColor = "rgba(255,255,255,0.22)";
  const corners = [
    [8, 8, 1, 1], [W - 8 - cornerSize, 8, -1, 1],
    [8, H - 8 - cornerSize, 1, -1], [W - 8 - cornerSize, H - 8 - cornerSize, -1, -1],
  ] as const;
  corners.forEach(([x, y, sx, sy]) => {
    ctx.strokeStyle = cornerColor;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y + cornerSize * sy); ctx.lineTo(x, y); ctx.lineTo(x + cornerSize * sx, y); ctx.stroke();
  });
}

function Bracket({ top, bottom, left, right }: { top?: string; bottom?: string; left?: string; right?: string }) {
  return (
    <span
      className="absolute block pointer-events-none"
      style={{
        width: "8px",
        height: "8px",
        top, bottom, left, right,
        borderTop: top !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderBottom: bottom !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderLeft: left !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderRight: right !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
      }}
    />
  );
}

export default function Banner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(Date.now());
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const BANNER_W = 728;
  const BANNER_H = 180;
  const CHAR_SIZE = 5;
  const TEXT_SIZE = 55;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;

    const tick = () => {
      const t = (Date.now() - startRef.current) * 0.001;
      drawASCIIFrame(canvas, t, CHAR_SIZE, TEXT_SIZE);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const downloadGIF = useCallback(async () => {
    setExporting(true);
    setDone(false);
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;

    const fps = 12;
    const duration = 3;
    const frameCount = fps * duration;
    const delay = Math.round(1000 / fps);

    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    const gif = GIFEncoder();
    const t0 = 0;

    for (let i = 0; i < frameCount; i++) {
      const t = t0 + (i / fps);
      drawASCIIFrame(canvas, t, CHAR_SIZE, TEXT_SIZE);
      const ctx = canvas.getContext("2d")!;
      const imageData = ctx.getImageData(0, 0, BANNER_W, BANNER_H);
      const data = imageData.data;

      const rgb = new Uint8Array(BANNER_W * BANNER_H * 3);
      for (let p = 0; p < BANNER_W * BANNER_H; p++) {
        rgb[p * 3 + 0] = data[p * 4 + 0];
        rgb[p * 3 + 1] = data[p * 4 + 1];
        rgb[p * 3 + 2] = data[p * 4 + 2];
      }

      const palette = quantize(rgb, 64, { format: "rgb444" });
      const index = applyPalette(rgb, palette, "rgb444");
      gif.writeFrame(index, BANNER_W, BANNER_H, { palette, delay });

      await new Promise<void>((r) => setTimeout(r, 0));
    }

    gif.finish();
    const bytes = gif.bytesView();
    const blob = new Blob([bytes], { type: "image/gif" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cybork-banner.gif";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4"
      style={{ background: "rgb(8, 8, 10)" }}
    >
      <div className="text-center mb-2">
        <p
          style={{
            color: "rgb(56,59,67)",
            fontSize: "9px",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Banner Preview — 728 × 180
        </p>
      </div>

      <div
        className="relative"
        style={{
          background: "rgba(15, 17, 20, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          padding: 0,
        }}
      >
        <Bracket top="4px" left="4px" />
        <Bracket top="4px" right="4px" />
        <Bracket bottom="4px" left="4px" />
        <Bracket bottom="4px" right="4px" />

        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "min(728px, calc(100vw - 32px))",
            height: "auto",
            imageRendering: "pixelated",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      <button
        onClick={downloadGIF}
        disabled={exporting}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 24px",
          background: exporting ? "rgba(56,59,67,0.4)" : "rgba(100,106,118,0.15)",
          border: "1px solid rgba(100,106,118,0.4)",
          color: done ? "rgb(127,255,127)" : "rgb(180,186,200)",
          fontSize: "11px",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: exporting ? "not-allowed" : "pointer",
          transition: "all 150ms",
        }}
        onMouseEnter={(e) => {
          if (!exporting) e.currentTarget.style.background = "rgba(100,106,118,0.28)";
        }}
        onMouseLeave={(e) => {
          if (!exporting) e.currentTarget.style.background = "rgba(100,106,118,0.15)";
        }}
      >
        {exporting ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Download size={13} />
        )}
        {exporting ? "Encoding GIF…" : done ? "Downloaded!" : "Download GIF"}
      </button>

      <p
        style={{
          color: "rgb(56,59,67)",
          fontSize: "9px",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.12em",
        }}
      >
        3 sec · 12 fps · 728×180 px
      </p>
    </div>
  );
}
