// Mini-librería de gráficos SVG, sin dependencias, pensada para animarse con GSAP/ScrollTrigger.
// Usa un sistema de coordenadas fijo (viewBox) y escala por CSS, igual que los SVG de matplotlib
// de referencia, pero generado desde los CSV reales en datos/.

const SVGNS = "http://www.w3.org/2000/svg";

function el(tag, attrs = {}, parent) {
  const node = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

function scaleLinear(domain, range) {
  const [d0, d1] = domain, [r0, r1] = range;
  const m = (r1 - r0) / (d1 - d0);
  return (v) => r0 + (v - d0) * m;
}

function pathFromPoints(points) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
}

// Crea el lienzo base con ejes y grilla. Devuelve svg + escalas + grupo "plot" para dibujar encima.
function baseChart({
  width = 640, height = 360, margin = { top: 18, right: 18, bottom: 34, left: 48 },
  xDomain, yDomain, xTicks = 5, yTicks = 5, xFormat = (v) => v, yFormat = (v) => v,
}) {
  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, class: "chart-svg" });
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const x = scaleLinear(xDomain, [0, plotW]);
  const y = scaleLinear(yDomain, [plotH, 0]);

  const root = el("g", { transform: `translate(${margin.left},${margin.top})` }, svg);

  // gridlines horizontales
  const gy = el("g", { class: "axis" }, root);
  const stepY = (yDomain[1] - yDomain[0]) / (yTicks - 1);
  for (let i = 0; i < yTicks; i++) {
    const v = yDomain[0] + stepY * i;
    const yy = y(v);
    el("line", { class: "gridline", x1: 0, x2: plotW, y1: yy, y2: yy }, gy);
    el("text", { x: -8, y: yy + 4, "text-anchor": "end" }, gy).textContent = yFormat(v);
  }
  // eje x
  const gx = el("g", { class: "axis" }, root);
  el("line", { x1: 0, x2: plotW, y1: plotH, y2: plotH }, gx);
  const stepX = (xDomain[1] - xDomain[0]) / (xTicks - 1);
  for (let i = 0; i < xTicks; i++) {
    const v = xDomain[0] + stepX * i;
    const xx = x(v);
    el("text", { x: xx, y: plotH + 20, "text-anchor": "middle" }, gx).textContent = xFormat(v);
  }

  const plot = el("g", {}, root);
  return { svg, x, y, plot, plotW, plotH, margin };
}

// Dibuja una línea y la deja lista para animarse (stroke-dasharray/offset) al hacer scroll.
function addLine(plot, data, xKey, yKey, xScale, yScale, className) {
  const pts = data.filter((d) => d[yKey] !== null && d[yKey] !== undefined)
    .map((d) => [xScale(d[xKey]), yScale(d[yKey])]);
  const path = el("path", { class: className, d: pathFromPoints(pts) }, plot);
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  return { path, length: len };
}

function addArea(plot, data, xKey, yKey, xScale, yScale, baseline, className) {
  const pts = data.filter((d) => d[yKey] !== null && d[yKey] !== undefined)
    .map((d) => [xScale(d[xKey]), yScale(d[yKey])]);
  if (!pts.length) return null;
  const d = `${pathFromPoints(pts)} L${pts[pts.length - 1][0].toFixed(2)},${baseline} L${pts[0][0].toFixed(2)},${baseline} Z`;
  const path = el("path", { class: className, d, opacity: 0 }, plot);
  return path;
}

function addDot(plot, cx, cy, r, className) {
  return el("circle", { cx, cy, r, class: className, opacity: 0 }, plot);
}

function addLabel(plot, x, y, text, className, anchor = "start") {
  const t = el("text", { x, y, class: className, "text-anchor": anchor, opacity: 0 }, plot);
  t.textContent = text;
  return t;
}

function addHLine(plot, yValue, yScale, plotW, className) {
  const yy = yScale(yValue);
  return el("line", { x1: 0, x2: plotW, y1: yy, y2: yy, class: className, opacity: 0 }, plot);
}

// Barras verticales (ej. anomalía de temperatura por año). classFn(d) decide el color.
function addBars(plot, data, xKey, yKey, xScale, yScale, zeroY, classFn) {
  const n = data.length;
  const bw = Math.max(1, (xScale(data[1] ? data[1][xKey] : data[0][xKey] + 1) - xScale(data[0][xKey])) * 0.82);
  const bars = data.map((d) => {
    const xx = xScale(d[xKey]) - bw / 2;
    const yy = yScale(d[yKey]);
    const h = Math.abs(yy - zeroY);
    const top = Math.min(yy, zeroY);
    const rect = el("rect", {
      x: xx, y: zeroY, width: bw, height: 0,
      class: classFn(d), "data-target-y": top, "data-target-h": h,
    }, plot);
    return rect;
  });
  return bars;
}
