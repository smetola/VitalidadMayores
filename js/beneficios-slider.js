/**
 * Beneficios Slider - Versión mejorada para pantallas pequeñas y medianas
 */
document.addEventListener('DOMContentLoaded', () => {
  // Solo inicializar en móvil
  const isMobile = window.innerWidth <= 480;
  if (!isMobile) return;

  const beneficiosSection = document.querySelector(".beneficios-nuevo");
  if (!beneficiosSection) return;
  
  const track = beneficiosSection.querySelector(".beneficios-wrapper");
  const controls = beneficiosSection.querySelector(".beneficios-slider-controls");
  if (!track || !controls) return;

  const dotsContainer = controls.querySelector(".slider-dots");
  const prevBtn = controls.querySelector(".slider-btn.prev");
  const nextBtn = controls.querySelector(".slider-btn.next");
  const cards = Array.from(track.querySelectorAll(".beneficio-fila"));

  // Limpiar dots existentes si hay
  while (dotsContainer.firstChild) {
    dotsContainer.removeChild(dotsContainer.firstChild);
  }

  // Crear dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Ir al beneficio ${i + 1}`);
    dot.dataset.index = i;
    dot.addEventListener("click", () => scrollToIndex(i));
    dotsContainer.appendChild(dot);
  });

  function scrollToIndex(i) {
    const card = cards[i];
    if (!card) return;
    const left = card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  }

  function getActiveIndex() {
    const center = track.scrollLeft + track.offsetWidth / 2;
    return cards.reduce((best, card, i) => {
      const cCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = Math.abs(center - cCenter);
      return diff < best.diff ? { i, diff } : best;
    }, { i: 0, diff: Infinity }).i;
  }

  function updateActive() {
    const idx = getActiveIndex();
    cards.forEach((c, i) => c.classList.toggle("is-active", i === idx));
    dotsContainer
      .querySelectorAll(".slider-dot")
      .forEach((dot, i) =>
        dot.setAttribute("aria-current", i === idx ? "true" : "false")
      );
  }

  // Inicializar al cargar
  setTimeout(() => {
    updateActive();
    // Asegúrate que los controles sean visibles
    controls.style.display = "flex";
  }, 100);

  // Listener para scroll
  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActive);
  });

  // Eventos de botones
  prevBtn?.addEventListener("click", () => {
    scrollToIndex(Math.max(0, getActiveIndex() - 1));
  });
  
  nextBtn?.addEventListener("click", () => {
    scrollToIndex(Math.min(cards.length - 1, getActiveIndex() + 1));
  });
  
  // Reaccionar a cambios de tamaño de ventana
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 480) {
      updateActive();
    }
  });
});