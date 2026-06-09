// ReactBits ASCIIText TS+CSS — with Canvas 2D fallback for non-WebGL environments
// WebGL path: THREE.js shader + AsciiFilter (full waves + chromatic aberration)
// Canvas 2D path: rasterise text → pixel sample → ASCII chars + gradient CSS

import { useEffect, useRef } from 'react';

/* ── helpers ─────────────────────────────────────────────────────────────── */

function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function map(n: number, s: number, e: number, s2: number, e2: number) {
  return ((n - s) / (e - s)) * (e2 - s2) + s2;
}

const CHARSET = " .':;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

/* ══════════════════════════════════════════════════════════════════════════
   WEBGL PATH  (THREE.js)
   ══════════════════════════════════════════════════════════════════════════ */

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;
void main() {
  vUv = uv;
  float t = uTime * 5.;
  vec3 p = position;
  p.x += sin(t + position.y) * 0.5 * uEnableWaves;
  p.y += cos(t + position.z) * 0.15 * uEnableWaves;
  p.z += sin(t + position.x) * uEnableWaves;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;
void main() {
  float t = uTime;
  vec2 pos = vUv;
  float r = texture2D(uTexture, pos + cos(t * 2. - t + pos.x) * .01).r;
  float g = texture2D(uTexture, pos + tan(t * .5 + pos.x - t) * .01).g;
  float b = texture2D(uTexture, pos - cos(t * 2. + t + pos.y) * .01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}`;

async function runWebGL(
  container: HTMLElement,
  text: string,
  asciiFontSize: number,
  textFontSize: number,
  textColor: string,
  planeBaseHeight: number,
  enableWaves: boolean,
  gradientCss: string,
  signal: AbortSignal,
) {
  const THREE = await import('three');

  // ── text canvas ────────────────────────────────────────────────────────
  const offscreen = document.createElement('canvas');
  const ctx2d = offscreen.getContext('2d')!;
  const font = `600 ${textFontSize}px Space Mono, monospace`;
  try { await document.fonts.load(font); } catch {}
  await document.fonts.ready;
  ctx2d.font = font;
  const m = ctx2d.measureText(text);
  offscreen.width  = Math.ceil(m.width) + 20;
  offscreen.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 20;
  ctx2d.font = font;
  ctx2d.fillStyle = textColor;
  ctx2d.fillText(text, 10, 10 + m.actualBoundingBoxAscent);

  if (signal.aborted) return;

  // ── THREE scene ────────────────────────────────────────────────────────
  const { width, height } = container.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.z = 30;
  const scene = new THREE.Scene();
  const texture = new THREE.CanvasTexture(offscreen);
  texture.minFilter = THREE.NearestFilter;
  const aspect = offscreen.width / offscreen.height;
  const geo = new THREE.PlaneGeometry(planeBaseHeight * aspect, planeBaseHeight, 36, 36);
  const mat = new THREE.ShaderMaterial({
    vertexShader, fragmentShader, transparent: true,
    uniforms: {
      uTime:         { value: 0 },
      uTexture:      { value: texture },
      uEnableWaves:  { value: enableWaves ? 1.0 : 0.0 },
    },
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // ── WebGL renderer ─────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  // Space Mono fixed width-to-height ratio (avoids measuring before font loads).
  const CHAR_W_GL = asciiFontSize * 0.601;

  // ── ASCII filter — flex wrapper centres the pre reliably on mobile ──────
  const filterDiv = document.createElement('div');
  filterDiv.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;pointer-events:none;';
  const pre = document.createElement('pre');
  Object.assign(pre.style, {
    fontFamily: "'Space Mono', monospace",
    fontSize: `${asciiFontSize}px`,
    margin: '0', padding: '0', lineHeight: '1em',
    userSelect: 'none', flexShrink: '0',
    backgroundImage: gradientCss,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', whiteSpace: 'pre',
  });
  const ascCanvas = document.createElement('canvas');
  const ascCtx = ascCanvas.getContext('2d')!;
  filterDiv.appendChild(pre);
  filterDiv.appendChild(ascCanvas);
  container.appendChild(filterDiv);

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    ascCanvas.width  = Math.max(1, Math.floor(w / CHAR_W_GL));
    ascCanvas.height = Math.max(1, Math.floor(h / asciiFontSize));
  };

  resize(width, height);

  const mouse = { x: width / 2, y: height / 2 };
  const onMouseMove = (e: MouseEvent) => {
    const b = container.getBoundingClientRect();
    mouse.x = e.clientX - b.left;
    mouse.y = e.clientY - b.top;
  };
  container.addEventListener('mousemove', onMouseMove);

  const ro = new ResizeObserver(entries => {
    const { width: w, height: h } = entries[0].contentRect;
    if (w > 0 && h > 0) resize(w, h);
  });
  ro.observe(container);

  let rafId = 0;
  const frame = () => {
    if (signal.aborted) return;
    rafId = requestAnimationFrame(frame);
    const t = Date.now() * 0.001;
    ctx2d.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx2d.font = font;
    ctx2d.fillStyle = textColor;
    ctx2d.fillText(text, 10, 10 + m.actualBoundingBoxAscent);
    texture.needsUpdate = true;
    mat.uniforms.uTime.value = Math.sin(t);
    const rx = map(mouse.y, 0, height, 0.5, -0.5);
    const ry = map(mouse.x, 0, width, -0.5, 0.5);
    mesh.rotation.x += (rx - mesh.rotation.x) * 0.05;
    mesh.rotation.y += (ry - mesh.rotation.y) * 0.05;
    renderer.render(scene, camera);

    // rasterise to ascii
    ascCtx.clearRect(0, 0, ascCanvas.width, ascCanvas.height);
    ascCtx.drawImage(renderer.domElement, 0, 0, ascCanvas.width, ascCanvas.height);
    const img = ascCtx.getImageData(0, 0, ascCanvas.width, ascCanvas.height).data;
    let str = '';
    for (let y = 0; y < ascCanvas.height; y++) {
      for (let x = 0; x < ascCanvas.width; x++) {
        const i = (x + y * ascCanvas.width) * 4;
        const a = img[i + 3];
        if (a < 8) { str += ' '; continue; }
        const hash = Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5) % 1;
        const density = (a / 255) * (0.55 + hash * 0.45);
        const idx = Math.round(density * (CHARSET.length - 1));
        str += CHARSET[idx];
      }
      str += '\n';
    }
    pre.textContent = str;
  };
  frame();

  signal.addEventListener('abort', () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    container.removeEventListener('mousemove', onMouseMove);
    if (filterDiv.parentNode) container.removeChild(filterDiv);
    texture.dispose(); geo.dispose(); mat.dispose();
    renderer.dispose(); renderer.forceContextLoss();
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   CANVAS 2D FALLBACK
   Samples text pixel-by-pixel and renders ASCII chars in a <pre> with
   gradient colouring. A sine-based wave distorts the sampling over time.
   ══════════════════════════════════════════════════════════════════════════ */

async function runCanvas2D(
  container: HTMLElement,
  text: string,
  asciiFontSize: number,
  textFontSize: number,
  textColor: string,
  planeBaseHeight: number,
  enableWaves: boolean,
  gradientCss: string,
  signal: AbortSignal,
) {
  // ── wait for Space Mono to load before measuring/rendering ────────────
  const font = `600 ${textFontSize}px Space Mono, monospace`;
  try { await document.fonts.load(font); } catch {}
  await document.fonts.ready;
  if (signal.aborted) return;

  // ── render text to an offscreen canvas ────────────────────────────────
  const offscreen = document.createElement('canvas');
  const ctx2d = offscreen.getContext('2d')!;
  ctx2d.font = font;
  const m = ctx2d.measureText(text);
  offscreen.width  = Math.ceil(m.width) + 20;
  offscreen.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 20;
  ctx2d.font = font;
  ctx2d.fillStyle = textColor;
  ctx2d.fillText(text, 10, 10 + m.actualBoundingBoxAscent);

  // Space Mono has a fixed 0.601 width-to-height ratio — use this instead
  // of measuring from canvas (which fails before the font loads on mobile).
  const CHAR_W = asciiFontSize * 0.601;

  // ── centering wrapper (flex — works reliably on mobile) ────────────────
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute', inset: '0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', pointerEvents: 'none',
  });
  container.appendChild(wrapper);

  // ── output pre element ─────────────────────────────────────────────────
  const pre = document.createElement('pre');
  Object.assign(pre.style, {
    fontFamily: "'Space Mono', monospace",
    fontSize: `${asciiFontSize}px`,
    margin: '0', padding: '0', lineHeight: '1em',
    userSelect: 'none', flexShrink: '0',
    backgroundImage: gradientCss,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', whiteSpace: 'pre',
  });
  wrapper.appendChild(pre);

  // ── sample canvas ──────────────────────────────────────────────────────
  const sampleCanvas = document.createElement('canvas');
  const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true })!;

  const getSize = () => {
    const { width, height } = container.getBoundingClientRect();
    return { w: Math.max(width, 60), h: Math.max(height, 30) };
  };

  let { w, h } = getSize();

  const buildSample = (cw: number, ch: number) => {
    const cols = Math.max(1, Math.floor(cw / CHAR_W));
    const rows = Math.max(1, Math.floor(ch / asciiFontSize));

    sampleCanvas.width  = cols;
    sampleCanvas.height = rows;

    // scale text to fill the sample canvas
    const scaleX = cols / offscreen.width;
    const scaleY = rows / offscreen.height;
    const scale  = Math.min(scaleX, scaleY) * 0.9;
    const dw = offscreen.width  * scale;
    const dh = offscreen.height * scale;
    const dx = (cols - dw) / 2;
    const dy = (rows - dh) / 2;

    sCtx.clearRect(0, 0, cols, rows);
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(offscreen, dx, dy, dw, dh);
    return { cols, rows };
  };

  let { cols, rows } = buildSample(w, h);

  let rafId = 0;
  let startTime = Date.now();

  const frame = () => {
    if (signal.aborted) return;
    rafId = requestAnimationFrame(frame);

    const t = (Date.now() - startTime) * 0.001;

    // Rebuild sample with optional wave distortion
    if (enableWaves) {
      sCtx.clearRect(0, 0, cols, rows);
      const scaleX = cols / offscreen.width;
      const scaleY = rows / offscreen.height;
      const scale  = Math.min(scaleX, scaleY) * 0.9;
      const dw = offscreen.width  * scale;
      const dh = offscreen.height * scale;
      const dx = (cols - dw) / 2;
      const dy = (rows - dh) / 2;
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = 'high';
      sCtx.drawImage(offscreen, dx, dy, dw, dh);
    }

    const img = sCtx.getImageData(0, 0, cols, rows).data;
    let str = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // subtle horizontal wave shift
        const srcCol = enableWaves
          ? Math.round(col + Math.sin(t * 2 + row * 0.3) * 0.8)
          : col;
        const sc = Math.max(0, Math.min(cols - 1, srcCol));
        const i  = (sc + row * cols) * 4;
        const a  = img[i + 3];
        if (a < 60) { str += ' '; continue; }
        const hash = Math.abs(Math.sin(col * 127.1 + row * 311.7) * 43758.5) % 1;
        const nt = (a - 60) / 195;
        const density = nt * (0.5 + hash * 0.5);
        const idx = Math.max(1, Math.round(density * (CHARSET.length - 1)));
        str += CHARSET[idx];
      }
      str += '\n';
    }
    pre.textContent = str;
  };

  frame();

  const ro = new ResizeObserver(entries => {
    const { width: nw, height: nh } = entries[0].contentRect;
    if (nw > 0 && nh > 0) {
      w = nw; h = nh;
      const r = buildSample(nw, nh);
      cols = r.cols; rows = r.rows;
    }
  });
  ro.observe(container);

  signal.addEventListener('abort', () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    if (wrapper.parentNode) container.removeChild(wrapper);
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   PUBLIC COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

export interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  gradientCss?: string;
  className?: string;
}

export default function ASCIIText({
  text          = 'CYBORK',
  asciiFontSize = 8,
  textFontSize  = 200,
  textColor     = '#ffffff',
  planeBaseHeight = 8,
  enableWaves   = true,
  gradientCss   = 'linear-gradient(135deg, rgba(200,160,60,1) 0%, rgba(127,255,127,0.9) 100%)',
  className     = '',
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ac = new AbortController();

    // Canvas2D path gives clean, stable letter shapes on all devices.
    // Awaits Space Mono font load before measuring so character widths are exact.
    const run = async () => {
      await runCanvas2D(container, text, asciiFontSize, textFontSize, textColor,
        planeBaseHeight, enableWaves, gradientCss, ac.signal);
    };
    run();
    return () => ac.abort();
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves, gradientCss]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}
