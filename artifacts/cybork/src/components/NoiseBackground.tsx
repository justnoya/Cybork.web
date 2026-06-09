import { useEffect, useRef } from "react";

/* ─── Value Noise Engine ──────────────────────────────────────────────────────
   Permutation-table based 2D value noise with bilinear interpolation.
   Matches the organic blob topology from the reference (hamishw.com).
   fBm (fractal Brownian Motion) adds multiple octaves for irregular edges.
*/
class VNoise {
  private readonly N = 512;
  private tbl: Float32Array;

  constructor() {
    this.tbl = new Float32Array(this.N * this.N);
    for (let i = 0; i < this.tbl.length; i++) {
      this.tbl[i] = Math.random();
    }
  }

  private at(ix: number, iy: number): number {
    const x = ((ix % this.N) + this.N) % this.N;
    const y = ((iy % this.N) + this.N) % this.N;
    return this.tbl[y * this.N + x];
  }

  /* Smooth bilinear noise sample */
  n(x: number, y: number): number {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix,       fy = y - iy;
    /* smoothstep curve for natural-looking transitions */
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    return (
      this.at(ix,     iy)     * (1 - sx) * (1 - sy) +
      this.at(ix + 1, iy)     *      sx  * (1 - sy) +
      this.at(ix,     iy + 1) * (1 - sx) *      sy  +
      this.at(ix + 1, iy + 1) *      sx  *      sy
    );
  }

  /* fBm — 4 octaves.
     Low frequency octave creates the large blob shapes.
     Higher octaves add the jagged/irregular boundary detail.  */
  fbm(x: number, y: number): number {
    const v =
      this.n(x * 1.0, y * 1.0) * 0.5000 +
      this.n(x * 2.0, y * 2.0) * 0.2500 +
      this.n(x * 4.0, y * 4.0) * 0.1250 +
      this.n(x * 8.0, y * 8.0) * 0.0625;
    return v / 0.9375; /* normalize to [0, 1] */
  }
}

/* ─── Color bands ─────────────────────────────────────────────────────────────
   6 hard bands from darkest (blends into background) to lightest gray.
   Directly maps the hamishw.com teal-to-gray palette → white/gray palette.

   Reference band lightness approximations (teal → white/gray equivalent):
     teal ~5%  → near-black  gray  [10, 10, 12]
     teal ~12% → very dark   gray  [20, 21, 24]
     teal ~22% → dark        gray  [36, 38, 44]
     teal ~33% → medium-dark gray  [56, 59, 67]
     teal ~45% → medium      gray  [76, 81, 92]
     teal ~56% → lighter     gray  [100,106,118]
*/
const BANDS: readonly [number, number, number][] = [
  [ 10,  10,  12],
  [ 20,  21,  24],
  [ 36,  38,  44],
  [ 56,  59,  67],
  [ 76,  81,  92],
  [100, 106, 118],
];

const NB = BANDS.length;

/* ─── Component ───────────────────────────────────────────────────────────── */
export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = new VNoise();
    let raf: number;
    let frame = 0;
    let tx = 0, ty = 0;

    /* Offscreen at reduced resolution — then scale up to main canvas.
       This is what creates the characteristic soft-but-defined blob edges,
       matching the reference exactly. */
    const off = document.createElement("canvas");
    const oct = off.getContext("2d")!;
    let img: ImageData;

    /* STEP: screen pixels per noise sample.
       6 → 1/36th of pixels to compute → real-time even on mobile.
       Bilinear upscaling preserves smoothness. */
    const STEP = 6;

    /* SCALE: noise units per screen pixel.
       At 0.0028, a 1400px screen spans 3.92 noise units → ~4 blobs across.
       Matches the reference blob density. */
    const SCALE = 0.0028;

    /* DRIFT: noise field offset per frame.
       0.00004 at 60fps → 0.0024 units/sec → crosses one blob in ~417 sec.
       Almost imperceptible — matches the reference's barely-visible motion. */
    const DRIFT = 0.000042;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      off.width     = Math.ceil(canvas.width  / STEP);
      off.height    = Math.ceil(canvas.height / STEP);
      img           = oct.createImageData(off.width, off.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      frame++;
      /* Diagonal drift — different x/y rates creates non-linear trajectory */
      tx += DRIFT;
      ty += DRIFT * 0.618; /* golden ratio offset → never repeats visibly */

      /* Recompute noise only every 3 frames — animation is too slow to need
         60fps worth of computation. Saves ~67% CPU. */
      if (frame % 3 === 0) {
        const W = off.width;
        const H = off.height;
        const d = img.data;

        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const v  = noise.fbm(x * STEP * SCALE + tx, y * STEP * SCALE + ty);
            const bi = Math.min(NB - 1, Math.floor(v * NB));
            const [r, g, b] = BANDS[bi];
            const i = (y * W + x) << 2; /* × 4 */
            d[i]     = r;
            d[i + 1] = g;
            d[i + 2] = b;
            d[i + 3] = 255;
          }
        }

        oct.putImageData(img, 0, 0);
      }

      /* Scale up to main canvas with bilinear smoothing.
         This is the key: LOW-res noise → HIGH-quality upscale =
         soft organic edges that match the hamishw.com aesthetic precisely. */
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
