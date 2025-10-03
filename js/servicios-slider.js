document.addEventListener("DOMContentLoaded", () => {
  const serviciosSection = document.querySelector(".servicios");
  if (!serviciosSection) return;
  
  const track = serviciosSection.querySelector(".servicios-grid");
  const controls = serviciosSection.querySelector(".slider-controls");
  if (!track || !controls) return;

  // Configurar accesibilidad según el tamaño de pantalla
  const isMobile = window.innerWidth <= 480;
  if (isMobile) {
    controls.removeAttribute('aria-hidden');
  } else {
    controls.setAttribute('aria-hidden', 'true');
  }

  const dotsContainer = controls.querySelector(".slider-dots");
  const prevBtn = controls.querySelector(".slider-btn.prev");
  const nextBtn = controls.querySelector(".slider-btn.next");
  const cards = Array.from(track.querySelectorAll(".servicio-card"));

  // Crear dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Ir al servicio ${i + 1}`);
    dot.setAttribute("aria-pressed", "false");
    dot.dataset.index = i;
    dot.addEventListener("click", () => scrollToIndex(i));
    dotsContainer.appendChild(dot);
  });

  function scrollToIndex(i) {
    const card = cards[i];
    if (!card) return;
    const left =
      card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2;
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
        dot.setAttribute("aria-pressed", i === idx ? "true" : "false")
      );
  }

  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActive);
  });

  prevBtn?.addEventListener("click", () => {
    scrollToIndex(Math.max(0, getActiveIndex() - 1));
  });
  
  nextBtn?.addEventListener("click", () => {
    scrollToIndex(Math.min(cards.length - 1, getActiveIndex() + 1));
  });

  updateActive();

  // Reaccionar a cambios de tamaño de ventana
  window.addEventListener("resize", () => {
    const currentIsMobile = window.innerWidth <= 480;
    if (currentIsMobile) {
      controls.removeAttribute('aria-hidden');
    } else {
      controls.setAttribute('aria-hidden', 'true');
    }
  });
});
