import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ════════════════════════════════════════════════════════════════════════════
   SHARED DESIGN — both renderers produce the same visual:

   • fBm noise with 4 octaves.  Each octave drifts in a unique direction over
     time → blobs morph and breathe, not just translate.
   • 6 hard gray bands (topographic contour map look).
   • Fully responsive: recalculates on window resize / orientation change.
   ════════════════════════════════════════════════════════════════════════════ */

/* ─── Color palette ──────────────────────────────────────────────────────── */
const BANDS: readonly [number, number, number][] = [
  [ 10,  10,  12],   // darkest (blends into page background)
  [ 20,  21,  24],
  [ 36,  38,  44],
  [ 56,  59,  67],
  [ 76,  81,  92],
  [100, 106, 118],   // lightest visible blob
];
const NB = BANDS.length;

/* ─── fBm drift vectors (noise-units / second) ───────────────────────────
   Same constants used in both GLSL and JS so visual matches perfectly.     */
const DRIFT = [
  [ 0.040, -0.025],   // octave 1 — large blobs, slow
  [-0.080,  0.064],   // octave 2
  [ 0.150, -0.120],   // octave 3
  [-0.260,  0.210],   // octave 4 — fine detail, fastest
] as const;

/* ════════════════════════════════════════════════════════════════════════════
   PATH A — WebGL / Three.js shader (GPU, 0% CPU after initial load)
   ════════════════════════════════════════════════════════════════════════════ */

const vert = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const frag = /* glsl */`
precision highp float;
uniform float uTime;
uniform vec2  uResolution;
varying vec2  vUv;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),                  hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float t = uTime;
  float v = 0.0;
  v += noise(p * 1.0 + t * vec2( 0.040, -0.025)) * 0.5000;
  v += noise(p * 2.0 + t * vec2(-0.080,  0.064)) * 0.2500;
  v += noise(p * 4.0 + t * vec2( 0.150, -0.120)) * 0.1250;
  v += noise(p * 8.0 + t * vec2(-0.260,  0.210)) * 0.0625;
  return v / 0.9375;
}

vec3 bandColor(float v) {
  vec3 c = vec3( 10.0,  10.0,  12.0) / 255.0;
  c = mix(c, vec3( 20.0,  21.0,  24.0) / 255.0, step(0.1667, v));
  c = mix(c, vec3( 36.0,  38.0,  44.0) / 255.0, step(0.3333, v));
  c = mix(c, vec3( 56.0,  59.0,  67.0) / 255.0, step(0.5000, v));
  c = mix(c, vec3( 76.0,  81.0,  92.0) / 255.0, step(0.6667, v));
  c = mix(c, vec3(100.0, 106.0, 118.0) / 255.0, step(0.8333, v));
  return c;
}

void main() {
  vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 4.0;
  gl_FragColor = vec4(bandColor(fbm(p)), 1.0);
}`;

function startWebGL(container: HTMLDivElement): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  Object.assign(renderer.domElement.style, {
    position: "absolute", inset: "0", width: "100%", height: "100%",
  });
  container.appendChild(renderer.domElement);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene  = new THREE.Scene();

  const uniforms = {
    uTime:       { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };

  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms,
      depthTest: false, depthWrite: false }),
  ));

  let raf: number;
  const t0 = performance.now();
  const tick = () => {
    raf = requestAnimationFrame(tick);
    uniforms.uTime.value = (performance.now() - t0) / 1000;
    renderer.render(scene, camera);
  };
  tick();

  const onResize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.uResolution.value.set(w, h);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", () => setTimeout(onResize, 200));

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   PATH B — Canvas 2D fallback (used when WebGL is unavailable, e.g. sandbox)
   Renders every frame with no throttle.  Per-octave drift creates true blob
   morphing.  Low-res offscreen canvas scaled up = soft contour edges.
   ════════════════════════════════════════════════════════════════════════════ */

class VNoise {
  private readonly N = 512;
  private t: Float32Array;
  constructor() {
    this.t = new Float32Array(this.N * this.N);
    for (let i = 0; i < this.t.length; i++) this.t[i] = Math.random();
  }
  private at(ix: number, iy: number): number {
    return this.t[((iy % this.N + this.N) % this.N) * this.N + (ix % this.N + this.N) % this.N];
  }
  sample(x: number, y: number): number {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix,       fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    return (
      this.at(ix,   iy)   * (1-sx)*(1-sy) +
      this.at(ix+1, iy)   *    sx *(1-sy) +
      this.at(ix,   iy+1) * (1-sx)*   sy  +
      this.at(ix+1, iy+1) *    sx *   sy
    );
  }
  fbm(x: number, y: number, sec: number): number {
    let v = 0;
    const freqs = [1, 2, 4, 8];
    const amps  = [0.5000, 0.2500, 0.1250, 0.0625];
    for (let o = 0; o < 4; o++) {
      const f = freqs[o];
      v += this.sample(
        x * f + sec * DRIFT[o][0],
        y * f + sec * DRIFT[o][1],
      ) * amps[o];
    }
    return v / 0.9375;
  }
}

function startCanvas(container: HTMLDivElement): () => void {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
  container.appendChild(canvas);

  const ctx  = canvas.getContext("2d")!;
  const off  = document.createElement("canvas");
  const octx = off.getContext("2d")!;
  const noise = new VNoise();
  const STEP  = 6;   // screen px per sample — bilinear upscale fills the gap
  // Noise units per screen height — controls blob density
  const SCALE = 0.0028;

  let img: ImageData;
  let raf: number;
  const t0 = performance.now();

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    off.width     = Math.ceil(canvas.width  / STEP);
    off.height    = Math.ceil(canvas.height / STEP);
    img           = octx.createImageData(off.width, off.height);
  };
  resize();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const sec = (performance.now() - t0) / 1000;
    const W = off.width, H = off.height;
    const aspect = canvas.width / canvas.height;
    const d = img.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        /* Match the GLSL UV → noise-space mapping exactly:
           p = uv * vec2(aspect, 1.0) * 4.0
           uv goes 0→1, so noise-space x goes 0 → aspect*4  */
        const nx = (x / W) * aspect * 4.0;
        const ny = (y / H) * 4.0;
        const v  = noise.fbm(nx, ny, sec);
        const bi = Math.min(NB - 1, Math.floor(v * NB));
        const [r, g, b] = BANDS[bi];
        const i = (y * W + x) << 2;
        d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
      }
    }

    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  };
  tick();

  const onResize = () => { resize(); };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", () => setTimeout(onResize, 200));

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    if (container.contains(canvas)) container.removeChild(canvas);
  };
}

/* ─── WebGL detection ────────────────────────────────────────────────────── */
function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") ?? c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function NoiseBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    if (hasWebGL()) {
      try {
        cleanup = startWebGL(el);
      } catch {
        cleanup = startCanvas(el);
      }
    } else {
      cleanup = startCanvas(el);
    }
    return cleanup;
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
