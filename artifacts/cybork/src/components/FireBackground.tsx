import { useEffect, useRef } from "react";

/* ─── Flame particle ─────────────────────────────────────────────────────── */
interface Flame {
  x: number;          // horizontal position
  baseX: number;      // origin x (for sine-drift)
  y: number;          // current y (rises upward = decreasing)
  vy: number;         // vertical speed (negative = upward)
  w: number;          // flame width
  h: number;          // flame height (taller = narrower near tip)
  life: number;
  maxLife: number;
  phase: number;      // sine phase offset for sway
  driftAmp: number;   // sway amplitude
  driftFreq: number;  // sway frequency
}

function makeFlame(canvasW: number, canvasH: number): Flame {
  /* mix of thin/tall flames and wide/short ones */
  const r = Math.random();
  const isBig = r > 0.70;
  const isMed = r > 0.38;

  const w = isBig
    ? 80  + Math.random() * 120
    : isMed
    ? 35  + Math.random() * 50
    : 14  + Math.random() * 24;

  const h = isBig
    ? 200 + Math.random() * 200
    : isMed
    ? 90  + Math.random() * 100
    : 40  + Math.random() * 60;

  const speed = isBig
    ? 0.8 + Math.random() * 0.8
    : isMed
    ? 1.4 + Math.random() * 1.2
    : 2.0 + Math.random() * 1.8;

  const maxLife = isBig
    ? 160 + Math.random() * 120
    : isMed
    ? 90  + Math.random() * 80
    : 50  + Math.random() * 50;

  return {
    x:         Math.random() * canvasW,
    baseX:     Math.random() * canvasW,
    y:         canvasH + h * 0.15,
    vy:        -speed,
    w,
    h,
    life:      0,
    maxLife,
    phase:     Math.random() * Math.PI * 2,
    driftAmp:  isBig ? 18 : isMed ? 10 : 5,
    driftFreq: 0.012 + Math.random() * 0.018,
  };
}

/* ─── Draw one flame as a tapered ellipse ────────────────────────────────── */
function drawFlame(ctx: CanvasRenderingContext2D, f: Flame, alpha: number) {
  const cx = f.x;
  const cy = f.y;
  const rx = f.w * 0.5;   // horizontal radius
  const ry = f.h * 0.5;   // vertical radius (flame height)

  /* vertical gradient: bright base → dim tip */
  const grad = ctx.createLinearGradient(cx, cy + ry, cx, cy - ry);
  grad.addColorStop(0,    `rgba(245,245,250,${(alpha * 0.85).toFixed(3)})`);
  grad.addColorStop(0.25, `rgba(220,222,228,${(alpha * 0.70).toFixed(3)})`);
  grad.addColorStop(0.55, `rgba(190,192,200,${(alpha * 0.35).toFixed(3)})`);
  grad.addColorStop(0.80, `rgba(160,162,170,${(alpha * 0.12).toFixed(3)})`);
  grad.addColorStop(1,    `rgba(150,150,160,0)`);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  /* clip to an ellipse so the top tapers to a point */
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();

  /* fill with gradient */
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function FireBackground({ opacity = 0.55 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const flames: Flame[] = [];
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* seed with flames already in various stages so first frame is full */
    for (let i = 0; i < 220; i++) {
      const f = makeFlame(canvas.width, canvas.height);
      /* scatter life so they're not all at the same stage */
      f.life = Math.random() * f.maxLife * 0.85;
      /* move y upward proportional to elapsed life */
      f.y = canvas.height + f.h * 0.15 - (f.life * (-f.vy));
      flames.push(f);
    }

    function tick() {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* soft global blur so individual ellipses blend into each other */
      ctx.filter = "blur(6px)";

      /* ── spawn new flames continuously ── */
      const target = Math.floor(canvas.width / 10); /* ~1 flame per 10px width */
      const spawnN = Math.max(0, Math.min(8, target - flames.length));
      for (let i = 0; i < spawnN; i++) {
        flames.push(makeFlame(canvas.width, canvas.height));
      }
      /* always trickle a few each frame for churn */
      if (Math.random() < 0.85) flames.push(makeFlame(canvas.width, canvas.height));

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.life++;

        /* rise */
        f.y += f.vy;

        /* organic left-right sway via sine */
        f.x = f.baseX + Math.sin(f.phase + t * f.driftFreq) * f.driftAmp;

        /* slowly narrow as flame rises (tip taper) */
        const prog = f.life / f.maxLife;
        const scale = 1 - prog * 0.55;
        const effectiveW = f.w * scale;
        const effectiveH = f.h * (0.9 + scale * 0.1);

        /* alpha envelope: quick fade-in → hold → long fade-out */
        let alpha: number;
        if (prog < 0.08)       alpha = prog / 0.08;
        else if (prog < 0.55)  alpha = 1;
        else                   alpha = 1 - (prog - 0.55) / 0.45;

        /* cull if off-screen (top) or exhausted */
        if (f.life >= f.maxLife || f.y + effectiveH < -50) {
          flames.splice(i, 1);
          continue;
        }

        drawFlame(ctx, { ...f, w: effectiveW, h: effectiveH }, alpha * 0.48);
      }

      ctx.filter = "none";
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
      style={{
        zIndex: 0,
        opacity,
        /* screen blend lets flames glow over the dark bg */
        mixBlendMode: "screen",
      }}
    />
  );
}
