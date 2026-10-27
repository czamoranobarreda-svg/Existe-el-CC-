// Set mínimo de íconos de línea, un solo grosor, propios (no se reutiliza nada del sitio de referencia).
// Cada ícono es un string SVG (viewBox 0 0 48 48, stroke="currentColor").

const ICONS = {
  hielo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" width="28" height="28" rx="2"/><path d="M10 19h28M10 29h28M19 10v28M29 10v28"/></svg>`,
  burbuja: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="26" r="13"/><circle cx="33" cy="14" r="5"/></svg>`,
  chimenea: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="20" width="12" height="20"/><rect x="12" y="14" width="16" height="6"/><path d="M18 14c0-4-3-4-3-8M24 14c0-5-4-5-4-10"/></svg>`,
  volcan: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 38 18 14l6 8 6-8 12 24Z"/><path d="M22 10c0-2 1-3 2-4 1 1 2 2 2 4" /></svg>`,
  sol: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="24" r="9"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.5 9.5l4.2 4.2M34.3 34.3l4.2 4.2M9.5 38.5l4.2-4.2M34.3 13.7l4.2-4.2"/></svg>`,
  termometro: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8a3 3 0 0 1 6 0v19.5a8 8 0 1 1-6 0Z"/><path d="M25 16v12"/></svg>`,
  ola: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 30c4-5 8-5 12 0s8 5 12 0 8-5 12 0 4 0 4 0"/><path d="M4 38c4-5 8-5 12 0s8 5 12 0 8-5 12 0 4 0 4 0"/></svg>`,
  nube: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 32a8 8 0 1 1 1.5-15.9A10 10 0 0 1 34 20a7 7 0 0 1-2 12H14Z"/></svg>`,
  nucleo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="17" y="6" width="14" height="36" rx="3"/><circle cx="23" cy="16" r="1.6" fill="currentColor" stroke="none"/><circle cx="26" cy="23" r="1.6" fill="currentColor" stroke="none"/><circle cx="21" cy="29" r="1.6" fill="currentColor" stroke="none"/><circle cx="27" cy="34" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  reloj: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M24 14v10l7 5"/></svg>`,
  calculadora: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="6" width="24" height="36" rx="3"/><path d="M17 14h14M17 22h2M23 22h2M29 22h2M17 29h2M23 29h2M29 29h2M17 36h2M23 36h2M29 36h2"/></svg>`,
  lupaAtomo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="12"/><circle cx="16" cy="18" r="2.4" fill="currentColor" stroke="none"/><circle cx="24" cy="22" r="1.4" fill="currentColor" stroke="none"/><path d="M29 29 40 40"/></svg>`,
  balanza: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6v34M14 42h20"/><path d="M8 14h14M26 14h14"/><path d="M8 14 3 24a5 5 0 0 0 10 0Z"/><path d="M36 14 31 24a5 5 0 0 0 10 0Z"/></svg>`,
  capas: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="10" r="4"/><rect x="8" y="20" width="32" height="8"/><path d="M14 36h20"/><path d="M24 14v6M18 28v6M30 28v6"/></svg>`,
  mareografo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40c4-5 8-5 12 0s8 5 12 0 8-5 8-5"/><path d="M14 6v28M14 6l6 4-6 4"/></svg>`,
  enchufe: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20v-9M24 20v-9M12 20h14v8a7 7 0 0 1-14 0Z"/><path d="M19 35v6"/></svg>`,
  periodico: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="10" width="32" height="28" rx="2"/><path d="M14 17h20M14 22h20M14 27h12M14 32h12"/></svg>`,
  pantallaCurva: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="9" width="36" height="24" rx="2"/><path d="M11 27c5 0 5-12 10-12s5 9 10 9 6-6 6-6"/><path d="M19 38h10"/></svg>`,
  frasco: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6h8M21 6v8l-9 16a5 5 0 0 0 4.4 7.4h15.2A5 5 0 0 0 36 30l-9-16V6"/><circle cx="24" cy="30" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  copo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M24 6v36M9 14l30 20M39 14 9 34"/></svg>`,
  mas1: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8a3 3 0 0 1 6 0v19.5a8 8 0 1 1-6 0Z"/><path d="M25 16v12"/><path d="M33 10h8M37 6v8"/></svg>`,
  chile: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4c-2 4-3 7-3 10 0 4 2 5 2 9s-3 5-3 10 2 6 2 11-1 5-1 8"/></svg>`,
  persona: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="14" r="7"/><path d="M10 42c0-9 6-15 14-15s14 6 14 15"/></svg>`,
  gota: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c8 11 13 18 13 25a13 13 0 0 1-26 0c0-7 5-14 13-25Z"/></svg>`,
  rayo: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="20" width="28" height="8" rx="2"/><path d="M26 8 16 24h8l-4 16 14-18h-8Z"/></svg>`,
};

function icon(name, cls) {
  return `<span class="icon ${cls || ""}" aria-hidden="true">${ICONS[name] || ""}</span>`;
}

function mountIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    const color = el.getAttribute("data-icon-color") || "blue";
    el.innerHTML = icon(name, color);
  });
}
