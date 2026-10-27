gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (REDUCED_MOTION) {
  // Las animaciones siguen disparándose al hacer scroll (son el mecanismo de revelado),
  // pero corren casi instantáneas en vez de animadas, como pide el guion de accesibilidad.
  gsap.globalTimeline.timeScale(60);
}

document.addEventListener("DOMContentLoaded", () => {
  mountIcons();

  buildHeroStripes();
  buildHeroIce();

  initSec1a();
  initSec1Extras();
  initSec2();
  initSec3();
  initSec4();
  initSec5();
  initSec6();
  initSec7a();
  initSec7b();
  initSec7c();
  initMitos();
  initSec9();
  initCierre();

  // Los íconos y gráficos cambian el alto de la página después del primer layout.
  requestAnimationFrame(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
});
