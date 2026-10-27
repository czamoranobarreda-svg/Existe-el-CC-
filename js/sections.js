// Coreografía de scroll por sección. Usa ScrollTrigger para disparar "pasos fijos"
// (como pide el guion: el gráfico queda fijo por CSS sticky, el texto dispara etapas).

function initScrolly(stepsContainerId, onStage) {
  const steps = document.querySelectorAll(`#${stepsContainerId} .step-card`);
  steps.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => activate(i),
      onEnterBack: () => activate(i),
    });
  });
  function activate(i) {
    steps.forEach((c, idx) => c.classList.toggle("is-active", idx === i));
    onStage(i);
  }
}

function fmtYear(v) { return v < 0 ? "hoy" : Math.round(v).toString(); }

// Dibuja una línea en proporción directa al avance del scroll (no de golpe al entrar),
// para que el efecto se note con claridad mientras se hace scroll.
function scrubLineDraw(lineObj, firstStepSelector) {
  ScrollTrigger.create({
    trigger: firstStepSelector,
    start: "top 90%",
    end: "top 35%",
    scrub: 0.35,
    onUpdate: (self) => {
      gsap.set(lineObj.path, { strokeDashoffset: lineObj.length * (1 - self.progress) });
    },
  });
}

/* ---------------- Portada ---------------- */
function buildHeroStripes() {
  const years = CLIMA_DATA.temperaturaGlobal;
  const vals = years.map((d) => d.anomalia_C_vs_1901_2000);
  const min = Math.min(...vals), max = Math.max(...vals);
  const host = document.getElementById("hero-stripes");
  const host2 = document.getElementById("cierre-stripes");
  [host, host2].forEach((wrap) => {
    if (!wrap) return;
    years.forEach((d) => {
      const t = (d.anomalia_C_vs_1901_2000 - min) / (max - min);
      const stripe = document.createElement("div");
      stripe.className = "stripe";
      stripe.style.background = stripeColor(t);
      wrap.appendChild(stripe);
    });
  });
  gsap.to(`#hero-stripes .stripe`, { opacity: 1, duration: 0.02, stagger: 0.008, ease: "none" });
  ScrollTrigger.create({
    trigger: "#cierre", start: "top 70%",
    onEnter: () => gsap.to("#cierre-stripes .stripe", { opacity: 1, duration: 0.02, stagger: 0.006, ease: "none" }),
  });
}
function stripeColor(t) {
  // azul frío -> blanco -> rojo cálido
  const blue = [30, 90, 130], white = [246, 243, 236], red = [176, 42, 28];
  const mix = (a, b, f) => Math.round(a + (b - a) * f);
  let c;
  if (t < 0.5) { const f = t / 0.5; c = [0, 1, 2].map((i) => mix(blue[i], white[i], f)); }
  else { const f = (t - 0.5) / 0.5; c = [0, 1, 2].map((i) => mix(white[i], red[i], f)); }
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function buildHeroIce() {
  const host = document.getElementById("hero-ice-row");
  const n = 7;
  for (let i = 0; i < n; i++) {
    const wrap = document.createElement("span");
    wrap.style.position = "relative";
    wrap.style.width = "26px"; wrap.style.height = "26px";
    wrap.innerHTML = `<span class="icon blue" style="position:absolute;inset:0;">${ICONS.hielo}</span><span class="icon blue melt" style="position:absolute;inset:0;opacity:0;">${ICONS.gota}</span>`;
    host.appendChild(wrap);
  }
  ScrollTrigger.create({
    trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.4,
    onUpdate: (self) => {
      gsap.to("#hero-ice-row .icon:not(.melt)", { opacity: 1 - self.progress, duration: 0 });
      gsap.to("#hero-ice-row .melt", { opacity: self.progress, y: self.progress * 6, duration: 0 });
    },
  });
}

/* ---------------- Sección 1 ---------------- */
function initSec1a() {
  const data = CLIMA_DATA.co2NucleosHielo;
  const xMax = data[0].anos_antes_de_1950;
  const host = document.getElementById("sec1a-viz");
  const { svg, x, y, plot, plotW } = baseChart({
    xDomain: [xMax, -75], yDomain: [150, 450], xTicks: 5, yTicks: 4,
    xFormat: (v) => (v <= 0 ? "hoy" : `hace ${Math.round(v / 1000)} mil`),
    yFormat: (v) => `${v}`,
  });
  host.appendChild(svg);

  const area = addArea(plot, data, "anos_antes_de_1950", "co2_ppm", x, y, y(150), "area-blue");
  const line = addLine(plot, data, "anos_antes_de_1950", "co2_ppm", x, y, "line-blue");
  const techo = addHLine(plot, 299, y, plotW, "gridline");
  techo.style.stroke = "var(--color-text-tertiary)";
  techo.style.strokeDasharray = "4 4";
  const lastPt = data[data.length - 1];
  const jump = el("line", { x1: x(0), x2: x(-75), y1: y(lastPt.co2_ppm), y2: y(427), class: "line-red", opacity: 0 }, plot);
  const dot = addDot(plot, x(-75), y(427), 4.5, "dot-red");
  const label = addLabel(plot, x(-75) - 8, y(427) - 10, "HOY · 427 ppm", "cap-label", "end");

  function stage(n) {
    gsap.to(area, { opacity: n >= 1 ? 0.5 : 0, duration: 0.6 });
    gsap.to(techo, { opacity: n >= 2 ? 1 : 0, duration: 0.5 });
    gsap.to([jump, dot, label], { opacity: n >= 3 ? 1 : 0, duration: 0.5 });
  }
  initScrolly("sec1a-steps", stage);
  stage(-1);
  scrubLineDraw(line, '#sec1a-steps .step-card[data-step="0"]');
}

function initSec1Extras() {
  // barras velocidad
  const velocityBars = document.querySelectorAll("#sec1-bars .bar-fill");
  ScrollTrigger.create({
    trigger: "#sec1-bars", start: "top 85%", end: "bottom 50%", scrub: 0.3,
    onUpdate: (self) => velocityBars.forEach((b) =>
      gsap.set(b, { width: `${Number(b.dataset.target) * self.progress}%` })),
  });

  // reloj 24h
  const ticks = document.getElementById("sec1-clock-ticks");
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r1 = 62, r2 = 70;
    const x1 = 80 + r1 * Math.cos(a), y1 = 80 + r1 * Math.sin(a);
    const x2 = 80 + r2 * Math.cos(a), y2 = 80 + r2 * Math.sin(a);
    el("line", { x1, y1, x2, y2, stroke: "var(--border-soft)", "stroke-width": 1.5 }, ticks);
  }
  // marca roja de la era industrial, justo antes de las 24h
  const ia = -Math.PI / 2 - 0.1;
  el("line", {
    x1: 80 + 62 * Math.cos(ia), y1: 80 + 62 * Math.sin(ia),
    x2: 80 + 72 * Math.cos(ia), y2: 80 + 72 * Math.sin(ia),
    stroke: "var(--red)", "stroke-width": 3, id: "sec1-clock-industrial", opacity: 0,
  }, ticks);

  ScrollTrigger.create({
    trigger: "#sec1-reloj", start: "top 85%", end: "bottom 45%", scrub: 0.35,
    onUpdate: (self) => {
      gsap.set("#sec1-clock-needle", { rotation: 360 * 3 * self.progress, transformOrigin: "80px 80px" });
      gsap.set("#sec1-clock-industrial", { opacity: self.progress > 0.9 ? 1 : 0 });
    },
  });
}

/* ---------------- Sección 2 ---------------- */
function initSec2() {
  const data = CLIMA_DATA.temperaturaGlobal;
  const host = document.getElementById("sec2-viz");
  const { svg, x, y, plot } = baseChart({
    xDomain: [1850, 2025], yDomain: [-0.45, 1.35], xTicks: 5, yTicks: 5,
    xFormat: (v) => Math.round(v), yFormat: (v) => v.toFixed(2),
  });
  host.appendChild(svg);
  const zeroY = y(0);
  const bars = addBars(plot, data, "ano", "anomalia_C_vs_1901_2000", x, y, zeroY,
    (d) => (d.anomalia_C_vs_1901_2000 >= 0 ? "dot-red" : "dot-blue"));
  bars.forEach((b) => gsap.set(b, { attr: { y: zeroY, height: 0 } }));

  function reveal(uptoYear) {
    bars.forEach((rect, i) => {
      const d = data[i];
      if (d.ano <= uptoYear) {
        gsap.to(rect, { attr: { y: rect.dataset.targetY, height: rect.dataset.targetH }, duration: 0.45 });
      } else {
        gsap.to(rect, { attr: { y: zeroY, height: 0 }, duration: 0.3 });
      }
    });
  }
  function stage(n) {
    if (n === 0) reveal(1880);
    else if (n === 1) reveal(1976);
    else reveal(2025);
  }
  initScrolly("sec2-steps", stage);
  stage(0);
}

/* ---------------- Sección 3 ---------------- */
function initSec3() {
  const data = CLIMA_DATA.co2MaunaLoa;
  const host = document.getElementById("sec3-viz");
  const { svg, x, y, plot } = baseChart({
    xDomain: [1959, 2025], yDomain: [300, 440], xTicks: 5, yTicks: 4,
    xFormat: (v) => Math.round(v), yFormat: (v) => Math.round(v),
  });
  host.appendChild(svg);
  const line = addLine(plot, data, "ano", "co2_ppm", x, y, "line-red");
  const hitos = [
    { ano: 1959, ppm: 316 }, { ano: 1988, ppm: 350 }, { ano: 2015, ppm: 400 }, { ano: 2025, ppm: 427 },
  ];
  const marks = hitos.map((h) => ({
    dot: addDot(plot, x(h.ano), y(h.ppm), 4, "dot-red"),
    label: addLabel(plot, x(h.ano), y(h.ppm) - 10, `${h.ano} · ${h.ppm}`, "cap-label", h.ano === 2025 ? "end" : "middle"),
  }));
  function stage(n) {
    marks.forEach((m, i) => gsap.to([m.dot, m.label], { opacity: i <= n ? 1 : 0, duration: 0.4 }));
  }
  initScrolly("sec3-steps", stage);
  stage(-1);
  scrubLineDraw(line, '#sec3-steps .step-card[data-step="0"]');

  // partículas: se encienden 4 de 10.000 en proporción al scroll
  const grid = document.getElementById("sec3-particles");
  const frag = document.createDocumentFragment();
  const dots = [];
  for (let i = 0; i < 10000; i++) {
    const d = document.createElement("div");
    d.className = "p";
    frag.appendChild(d);
    if (i < 4) dots.push(d);
  }
  grid.appendChild(frag);
  ScrollTrigger.create({
    trigger: grid, start: "top 85%", end: "top 40%", scrub: 0.3,
    onUpdate: (self) => {
      const n = Math.round(self.progress * dots.length);
      dots.forEach((d, i) => d.classList.toggle("on", i < n));
    },
  });

  // invernadero: la banda de gases se engrosa y rebota más calor en proporción al scroll
  ScrollTrigger.create({
    trigger: "#sec3-greenhouse", start: "top 85%", end: "bottom 40%", scrub: 0.3,
    onUpdate: (self) => {
      gsap.set("#gh-band", { attr: { height: 14 + self.progress * 8, y: 90 - self.progress * 6 } });
      gsap.set("#gh-bounce", { opacity: self.progress });
    },
  });
}

/* ---------------- Sección 4 ---------------- */
function initSec4() {
  const data = CLIMA_DATA.emisionesMundo;
  const host = document.getElementById("sec4-viz");
  const { svg, x, y, plot } = baseChart({
    xDomain: [1850, 2025], yDomain: [0, 42], xTicks: 5, yTicks: 5,
    xFormat: (v) => Math.round(v), yFormat: (v) => Math.round(v),
  });
  host.appendChild(svg);
  const area = addArea(plot, data, "ano", "gt_co2", x, y, y(0), "area-red");
  const line = addLine(plot, data, "ano", "gt_co2", x, y, "line-red");
  const hitos = [{ ano: 1900, v: 2 }, { ano: 1950, v: 6 }, { ano: 2024, v: 38.6 }];
  const marks = hitos.map((h) => ({
    dot: addDot(plot, x(h.ano), y(h.v), 4, "dot-red"),
    label: addLabel(plot, x(h.ano), y(h.v) - 10, `${h.ano} · ${h.v} Gt`, "cap-label", h.ano === 2024 ? "end" : "middle"),
  }));
  function stage(n) {
    gsap.to(area, { opacity: n >= 0 ? 0.55 : 0, duration: 0.8 });
    marks.forEach((m, i) => gsap.to([m.dot, m.label], { opacity: i <= n ? 1 : 0, duration: 0.4 }));
  }
  initScrolly("sec4-steps", stage);
  stage(-1);
  scrubLineDraw(line, '#sec4-steps .step-card[data-step="0"]');

  // bloques volcanes vs humanos
  const row = document.getElementById("sec4-volcano-row");
  const volcanoBlock = document.createElement("div");
  volcanoBlock.className = "block volcano"; volcanoBlock.style.opacity = 0;
  row.appendChild(volcanoBlock);
  const blocks = [volcanoBlock];
  for (let i = 0; i < 60; i++) {
    const b = document.createElement("div");
    b.className = "block"; b.style.opacity = 0;
    row.appendChild(b); blocks.push(b);
  }
  ScrollTrigger.create({
    trigger: "#sec4-volcano", start: "top 85%", end: "bottom 45%", scrub: 0.3,
    onUpdate: (self) => {
      const n = Math.round(self.progress * blocks.length);
      blocks.forEach((b, i) => gsap.set(b, { opacity: i < n ? 1 : 0 }));
    },
  });
}

/* ---------------- Sección 5 ---------------- */
function initSec5() {
  const irr = CLIMA_DATA.irradianciaSolar;
  const temp = CLIMA_DATA.temperaturaGlobal.filter((d) => d.ano <= 2019);
  const host = document.getElementById("sec5-viz");

  const panelA = baseChart({ width: 640, height: 150, xDomain: [1880, 2019], yDomain: [1360.4, 1362.1], xTicks: 4, yTicks: 3, xFormat: Math.round, yFormat: (v) => v.toFixed(1) });
  const panelB = baseChart({ width: 640, height: 150, xDomain: [1880, 2019], yDomain: [-0.45, 1.1], xTicks: 4, yTicks: 3, xFormat: Math.round, yFormat: (v) => v.toFixed(1) });
  host.appendChild(panelA.svg); host.appendChild(panelB.svg);

  const regionA = el("rect", { x: panelA.x(1960), y: 0, width: panelA.plotW - panelA.x(1960), height: panelA.plotH, fill: "var(--border-soft)", opacity: 0 }, panelA.plot);
  panelA.plot.insertBefore(regionA, panelA.plot.firstChild);
  const regionB = el("rect", { x: panelB.x(1960), y: 0, width: panelB.plotW - panelB.x(1960), height: panelB.plotH, fill: "var(--border-soft)", opacity: 0 }, panelB.plot);
  panelB.plot.insertBefore(regionB, panelB.plot.firstChild);

  const lineA = addLine(panelA.plot, irr, "ano", "w_m2", panelA.x, panelA.y, "line-red");
  const lineB = addLine(panelB.plot, temp, "ano", "anomalia_C_vs_1901_2000", panelB.x, panelB.y, "line-blue");

  function stage(n) {
    gsap.to([regionA, regionB], { opacity: n >= 2 ? 0.5 : 0, duration: 0.6 });
  }
  initScrolly("sec5-steps", stage);
  stage(-1);
  scrubLineDraw(lineA, '#sec5-steps .step-card[data-step="0"]');
  scrubLineDraw(lineB, '#sec5-steps .step-card[data-step="1"]');

  ScrollTrigger.create({
    trigger: "#sec5-strat", start: "top 85%", end: "bottom 45%", scrub: 0.3,
    onUpdate: (self) => gsap.set("#sec5-strat rect", { opacity: self.progress }),
  });
}

/* ---------------- Sección 6 ---------------- */
function initSec6() {
  const pts = document.querySelectorAll("#sec6-timeline .timeline-pt");
  ScrollTrigger.create({
    trigger: "#sec6-timeline", start: "top 65%", end: "bottom 60%", scrub: 0.5,
    onUpdate: (self) => {
      gsap.set("#sec6-fill", { width: `${self.progress * 100}%` });
      const active = Math.floor(self.progress * pts.length * 0.999);
      pts.forEach((p, i) => p.classList.toggle("on", i <= active));
    },
  });
}

/* ---------------- Sección 7 ---------------- */
function initSec7a() {
  const data = CLIMA_DATA.hieloArtico;
  const host = document.getElementById("sec7a-viz");
  const { svg, x, y, plot } = baseChart({
    xDomain: [1979, 2025], yDomain: [0, 8], xTicks: 5, yTicks: 4,
    xFormat: Math.round, yFormat: (v) => v,
  });
  host.appendChild(svg);
  const area = addArea(plot, data, "ano", "extension_millones_km2", x, y, y(0), "area-blue");
  const line = addLine(plot, data, "ano", "extension_millones_km2", x, y, "line-blue");
  const dotStart = addDot(plot, x(1979), y(7.05), 4, "dot-blue");
  const labelStart = addLabel(plot, x(1979) + 8, y(7.05) - 6, "1979 · 7,05", "cap-label");
  const dotEnd = addDot(plot, x(2025), y(4.75), 4, "dot-red");
  const labelEnd = addLabel(plot, x(2025) - 8, y(4.75) - 10, "2025 · 4,75", "cap-label", "end");

  function stage(n) {
    gsap.to(area, { opacity: n >= 0 ? 0.5 : 0, duration: 0.8 });
    gsap.to([dotStart, labelStart], { opacity: n >= 0 ? 1 : 0, duration: 0.4 });
    gsap.to([dotEnd, labelEnd], { opacity: n >= 1 ? 1 : 0, duration: 0.4 });
  }
  initScrolly("sec7a-steps", stage);
  stage(-1);
  scrubLineDraw(line, '#sec7a-steps .step-card[data-step="0"]');

  const chileRow = document.getElementById("sec7a-chile-row");
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    s.innerHTML = icon("chile", "blue");
    s.style.opacity = 0;
    chileRow.appendChild(s);
  }
  const chileSpans = chileRow.querySelectorAll("span");
  ScrollTrigger.create({
    trigger: "#sec7a-chile-row", start: "top 90%", end: "bottom 55%", scrub: 0.3,
    onUpdate: (self) => {
      const n = Math.round(self.progress * chileSpans.length);
      chileSpans.forEach((s, i) => gsap.set(s, { opacity: i < n ? 1 : 0 }));
    },
  });
}

function initSec7b() {
  const data = CLIMA_DATA.nivelMar;
  const host = document.getElementById("sec7b-viz");
  const { svg, x, y, plot } = baseChart({
    xDomain: [1880, 2025], yDomain: [-20, 280], xTicks: 5, yTicks: 4,
    xFormat: Math.round, yFormat: (v) => v,
  });
  host.appendChild(svg);
  const lineCsiro = addLine(plot, data, "ano", "csiro_mm", x, y, "line-blue");
  const lineNoaa = addLine(plot, data.filter((d) => d.noaa_mm !== null), "ano", "noaa_mm", x, y, "line-red");
  function stage() {}
  initScrolly("sec7b-steps", stage);
  scrubLineDraw(lineCsiro, '#sec7b-steps .step-card[data-step="0"]');
  scrubLineDraw(lineNoaa, '#sec7b-steps .step-card[data-step="1"]');
}

function initSec7c() {
  const host = document.getElementById("sec7c-plugs");
  for (let i = 0; i < 37; i++) {
    const s = document.createElement("span");
    s.innerHTML = icon("enchufe", "red");
    s.style.opacity = 0;
    s.style.width = "22px"; s.style.height = "22px";
    host.appendChild(s);
  }
  const plugSpans = host.querySelectorAll("span");
  ScrollTrigger.create({
    trigger: host, start: "top 85%", end: "bottom 40%", scrub: 0.3,
    onUpdate: (self) => {
      const n = Math.round(self.progress * plugSpans.length);
      plugSpans.forEach((s, i) => gsap.set(s, { opacity: i < n ? 1 : 0 }));
    },
  });
}

/* ---------------- Sección 8: mitos ---------------- */
function initMitos() {
  document.querySelectorAll(".mito-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("flipped"); }
    });
  });
}

/* ---------------- Sección 9 ---------------- */
function initSec9() {
  ScrollTrigger.create({
    trigger: "#sec9-map", start: "top 90%", end: "bottom 55%", scrub: 0.3,
    onUpdate: (self) => gsap.set("#sec9-centro", { opacity: self.progress }),
  });

  const grid = document.getElementById("sec9-drops");
  const deficit = 35, human = 9;
  for (let i = 0; i < 100; i++) {
    const s = document.createElement("span");
    let cls = "icon neutral-blue";
    if (i < human) cls = "icon red";
    else if (i < deficit) cls = "icon neutral-empty";
    else cls = "icon blue";
    s.className = cls;
    s.style.width = "100%"; s.style.opacity = 0;
    s.innerHTML = ICONS.gota;
    grid.appendChild(s);
  }
  const dropSpans = grid.querySelectorAll("span");
  ScrollTrigger.create({
    trigger: grid, start: "top 85%", end: "bottom 40%", scrub: 0.3,
    onUpdate: (self) => {
      const n = Math.round(self.progress * dropSpans.length);
      dropSpans.forEach((s, i) => gsap.set(s, { opacity: i < n ? 1 : 0 }));
    },
  });

  const people = document.querySelectorAll("#sec9-people .ton");
  const targets = [4.0, 4.7];
  ScrollTrigger.create({
    trigger: "#sec9-people", start: "top 80%",
    onEnter: () => people.forEach((el, i) => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: targets[i], duration: 1.1, ease: "power1.out",
        onUpdate: () => { el.textContent = obj.v.toFixed(1).replace(".", ",") + " t"; },
      });
    }),
  });
}

/* ---------------- Cierre ---------------- */
function initCierre() {
  ScrollTrigger.create({
    trigger: "#cierre-budget", start: "top 70%", end: "bottom 40%", scrub: 0.5,
    onUpdate: (self) => {
      const blocks = document.querySelectorAll("#cierre-budget .budget-block");
      const active = self.progress * blocks.length;
      blocks.forEach((b, i) => { b.style.opacity = i < active ? 1 - Math.max(0, active - i - 1) : 1; });
    },
  });
}
