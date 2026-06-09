import { useEffect, useRef } from "react";

/* ─── Flame shape ────────────────────────────────────────────────────────────
   Draws a pointed flame silhouette matching the Cybork logo:
   - Wide base
   - Concave sides that narrow inward at mid-height
   - Sharp pointed tip
   Optionally adds an inner secondary tip (the "inner flame" cutout look)
*/
function drawFlameShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number,
  height: number,
  alpha: number,
  tipOffset: number = 0, // slight horizontal tip lean
) {
  const hw = width / 2;
  const tipX = cx + tipOffset;
  const tipY = baseY - height;

  /* concave waist — about 38% up from base */
  const waistY = baseY - height * 0.40;
  const waistInset = hw * 0.30;

  /* gradient: white at base, dims toward tip */
  const grad = ctx.createLinearGradient(cx, baseY, tipX, tipY);
  grad.addColorStop(0,    `rgba(255,255,255,${(alpha).toFixed(3)})`);
  grad.addColorStop(0.30, `rgba(230,232,238,${(alpha * 0.82).toFixed(3)})`);
  grad.addColorStop(0.60, `rgba(195,198,210,${(alpha * 0.45).toFixed(3)})`);
  grad.addColorStop(0.85, `rgba(170,172,185,${(alpha * 0.15).toFixed(3)})`);
  grad.addColorStop(1,    `rgba(160,162,175,0)`);

  ctx.beginPath();

  /* bottom-left corner */
  ctx.moveTo(cx - hw, baseY);

  /* LEFT side: straight base → concave waist → pointed tip */
  ctx.bezierCurveTo(
    cx - hw,          baseY - height * 0.12,  /* hug base */
    cx - waistInset,  waistY,                  /* concave waist */
    tipX, tipY,                                /* tip */
  );

  /* RIGHT side: tip → concave waist → base-right */
  ctx.bezierCurveTo(
    cx + waistInset,  waistY,
    cx + hw,          baseY - height * 0.12,
    cx + hw, baseY,
  );

  /* soft base arc */
  ctx.quadraticCurveTo(cx, baseY + hw * 0.08, cx - hw, baseY);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();
}

/* ─── Particle ───────────────────────────────────────────────────────────── */
interface FP {
  baseX: number;
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  life: number;
  maxLife: number;
  phase: number;
  driftAmp: number;
  driftFreq: number;
  tipLean: number;
  size: "sm" | "md" | "lg";
}

function makeFlame(W: number, H: number): FP {
  const r = Math.random();
  const size: FP["size"] = r > 0.72 ? "lg" : r > 0.42 ? "md" : "sm";

  const w =
    size === "lg" ? 70 + Math.random() * 100 :
    size === "md" ? 30 + Math.random() * 45  :
                    10 + Math.random() * 20;

  const h =
    size === "lg" ? 180 + Math.random() * 200 :
    size === "md" ? 80  + Math.random() * 90  :
                    35  + Math.random() * 45;

  const speed =
    size === "lg" ? 0.7  + Math.random() * 0.7 :
    size === "md" ? 1.2  + Math.random() * 1.0 :
                    2.0  + Math.random() * 1.8;

  const maxLife =
    size === "lg" ? 170 + Math.random() * 130 :
    size === "md" ? 95  + Math.random() * 80  :
                    50  + Math.random() * 50;

  const bx = Math.random() * W;

  return {
    baseX: bx,
    x: bx,
    y: H + h * 0.2,
    vy: -speed,
    w, h,
    life: 0,
    maxLife,
    phase: Math.random() * Math.PI * 2,
    driftAmp:  size === "lg" ? 22 : size === "md" ? 12 : 5,
    driftFreq: 0.010 + Math.random() * 0.016,
    tipLean:   (Math.random() - 0.5) * w * 0.18,
    size,
  };
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function FireBackground({ opacity = 0.50 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const flames: FP[] = [];
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* seed with a full field of flames at varied life stages */
    for (let i = 0; i < 200; i++) {
      const f = makeFlame(canvas.width, canvas.height);
      f.life = Math.random() * f.maxLife * 0.80;
      f.y    = canvas.height + f.h * 0.2 - f.life * (-f.vy);
      flames.push(f);
    }

    function tick() {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* soft per-frame blur blends individual flames together */
      ctx.filter = "blur(5px)";
      ctx.globalCompositeOperation = "screen";

      /* spawn to maintain density */
      const target = Math.floor(canvas.width / 9);
      if (flames.length < target) {
        const n = Math.min(10, target - flames.length);
        for (let i = 0; i < n; i++) flames.push(makeFlame(canvas.width, canvas.height));
      }
      if (Math.random() < 0.90) flames.push(makeFlame(canvas.width, canvas.height));

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.life++;
        f.y += f.vy;

        /* organic sway */
        f.x = f.baseX + Math.sin(f.phase + t * f.driftFreq) * f.driftAmp;

        const prog = f.life / f.maxLife;

        /* shrink as flame rises — tip narrows */
        const scaleFactor = 1 - prog * 0.62;
        const fw = f.w * scaleFactor;
        const fh = f.h * (0.85 + scaleFactor * 0.15);

        /* alpha: quick in → hold → fade out */
        let alpha: number;
        if (prog < 0.08)       alpha = prog / 0.08;
        else if (prog < 0.50)  alpha = 1;
        else                   alpha = 1 - (prog - 0.50) / 0.50;

        const maxA = f.size === "lg" ? 0.38 : f.size === "md" ? 0.30 : 0.24;
        const a = alpha * maxA;

        if (f.life >= f.maxLife || f.y + fh < -80 || fw < 1) {
          flames.splice(i, 1);
          continue;
        }

        drawFlameShape(ctx, f.x, f.y, fw, fh, a, f.tipLean * scaleFactor);
      }

      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity, mixBlendMode: "screen" }}
    />
  );
}
