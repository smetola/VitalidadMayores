/**
 * Beneficios Slider - Convierte la sección de beneficios en un slider para dispositivos móviles
 */
document.addEventListener('DOMContentLoaded', () => {
  // Constantes
  const MOBILE_BREAKPOINT = 1100;
  const ACTIVE_DOT_COLOR = '#b57f50';
  const INACTIVE_DOT_COLOR = '#ddd';
  
  // Elementos principales
  const container = document.querySelector('.beneficios-nuevo');
  const slides = Array.from(document.querySelectorAll('.beneficio-fila'));
  
  // Variables de estado
  let isSliderActive = false;
  let currentIndex = 0;
  let sliderWrapper = null;
  let dotsContainer = null;
  let navigationButtons = { prev: null, next: null };
  let originalStyles = {
    container: {},
    slides: []
  };
  
  // Inicialización
  init();
  
  function init() {
    // Guardar estilos originales
    saveOriginalStyles();
    
    // Verificar si debemos activar el slider
    checkScreenSize();
    
    // Listener para redimensión de ventana
    window.addEventListener('resize', checkScreenSize);
  }
  
  function saveOriginalStyles() {
    // Guardar estilos del contenedor
    const containerStyles = window.getComputedStyle(container);
    originalStyles.container = {
      overflow: containerStyles.overflow,
      padding: containerStyles.padding,
      position: containerStyles.position
    };
    
    // Guardar estilos de cada slide
    slides.forEach((slide, index) => {
      const slideStyles = window.getComputedStyle(slide);
      originalStyles.slides[index] = {
        flex: slideStyles.flex,
        width: slideStyles.width,
        transform: slideStyles.transform,
        margin: slideStyles.margin,
        boxShadow: slideStyles.boxShadow
      };
    });
  }
  
  function checkScreenSize() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    
    if (isMobile && !isSliderActive) {
      activateSlider();
    } else if (!isMobile && isSliderActive) {
      deactivateSlider();
    }
  }
  
  function activateSlider() {
    if (isSliderActive) return;
    
    // 1. Crear wrapper para el slider
    sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('beneficios-slider-wrapper');
    sliderWrapper.style.cssText = `
      display: flex;
      transition: transform 0.3s ease;
      width: ${slides.length * 100}%;
    `;
    
    // 2. Configurar el contenedor
    container.style.overflow = 'hidden';
    container.style.padding = '0';
    container.style.position = 'relative';
    
    // 3. Configurar cada slide
    slides.forEach((slide) => {
      // Aplicar estilos para el slider
      slide.style.flex = '0 0 auto';
      slide.style.width = `${100 / slides.length}%`;
      slide.style.transform = 'none';
      slide.style.margin = '0';
      slide.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      
      // Mover al wrapper
      sliderWrapper.appendChild(slide);
    });
    
    // 4. Añadir wrapper al contenedor
    container.appendChild(sliderWrapper);
    
    // 5. Crear navegación
    createNavigation();
    
    // 6. Configurar eventos táctiles
    setupTouchEvents();
    
    isSliderActive = true;
    goToSlide(0);
  }
  
  function deactivateSlider() {
    if (!isSliderActive) return;
    
    // 1. Restaurar slides al contenedor principal
    slides.forEach((slide, index) => {
      // Restaurar estilos originales
      const originalStyle = originalStyles.slides[index];
      if (originalStyle) {
        slide.style.flex = originalStyle.flex;
        slide.style.width = originalStyle.width;
        slide.style.transform = originalStyle.transform;
        slide.style.margin = originalStyle.margin;
        slide.style.boxShadow = originalStyle.boxShadow;
      }
      
      // Mover de vuelta al contenedor principal
      container.appendChild(slide);
    });
    
    // 2. Eliminar wrapper
    if (sliderWrapper && sliderWrapper.parentNode === container) {
      container.removeChild(sliderWrapper);
    }
    
    // 3. Eliminar navegación
    if (dotsContainer && dotsContainer.parentNode === container) {
      container.removeChild(dotsContainer);
    }
    
    // 4. Eliminar botones de navegación
    if (navigationButtons.prev && navigationButtons.prev.parentNode === container) {
      container.removeChild(navigationButtons.prev);
    }
    if (navigationButtons.next && navigationButtons.next.parentNode === container) {
      container.removeChild(navigationButtons.next);
    }
    
    // 5. Restaurar estilos del contenedor
    const originalContainerStyle = originalStyles.container;
    container.style.overflow = originalContainerStyle.overflow;
    container.style.padding = originalContainerStyle.padding;
    container.style.position = originalContainerStyle.position;
    
    // 6. Remover eventos táctiles
    removeTouchEvents();
    
    isSliderActive = false;
  }
  
  function createNavigation() {
    // 1. Contenedor para los puntos
    dotsContainer = document.createElement('div');
    dotsContainer.classList.add('beneficios-slider-dots');
    dotsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 20px 0;
    `;
    
    // 2. Crear puntos
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('beneficios-slider-dot');
      dot.setAttribute('aria-label', `Ir al beneficio ${index + 1}`);
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${index === 0 ? ACTIVE_DOT_COLOR : INACTIVE_DOT_COLOR};
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background-color 0.3s ease;
      `;
      
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    container.appendChild(dotsContainer);
    
    // 3. Crear botones de navegación
    const prevButton = document.createElement('button');
    prevButton.classList.add('beneficios-slider-prev');
    prevButton.setAttribute('aria-label', 'Anterior beneficio');
    prevButton.innerHTML = '&lt;';
    prevButton.style.cssText = `
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      background-color: rgba(255,255,255,0.8);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 2;
      opacity: 0.5;
      pointer-events: none;
    `;
    
    const nextButton = document.createElement('button');
    nextButton.classList.add('beneficios-slider-next');
    nextButton.setAttribute('aria-label', 'Siguiente beneficio');
    nextButton.innerHTML = '&gt;';
    nextButton.style.cssText = `
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      background-color: rgba(255,255,255,0.8);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 2;
    `;
    
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    container.appendChild(prevButton);
    container.appendChild(nextButton);
    
    navigationButtons.prev = prevButton;
    navigationButtons.next = nextButton;
  }
  
  // Variables para eventos táctiles
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50; // Umbral para considerar un swipe
    
    if (diff > threshold) {
      // Swipe izquierda (siguiente)
      nextSlide();
    } else if (diff < -threshold) {
      // Swipe derecha (anterior)
      prevSlide();
    }
  }
  
  function setupTouchEvents() {
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  function removeTouchEvents() {
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchend', handleTouchEnd);
  }
  
  function goToSlide(index) {
    if (!isSliderActive) return;
    
    // Asegurar que el índice está dentro de los límites
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    currentIndex = index;
    
    // Mover el wrapper
    sliderWrapper.style.transform = `translateX(-${index * (100 / slides.length)}%)`;
    
    // Actualizar los puntos de navegación
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.beneficios-slider-dot');
      dots.forEach((dot, i) => {
        dot.style.backgroundColor = i === index ? ACTIVE_DOT_COLOR : INACTIVE_DOT_COLOR;
      });
    }
    
    // Actualizar botones de navegación
    if (navigationButtons.prev) {
      navigationButtons.prev.style.opacity = index === 0 ? '0.5' : '1';
      navigationButtons.prev.style.pointerEvents = index === 0 ? 'none' : 'auto';
    }
    
    if (navigationButtons.next) {
      navigationButtons.next.style.opacity = index === slides.length - 1 ? '0.5' : '1';
      navigationButtons.next.style.pointerEvents = index === slides.length - 1 ? 'none' : 'auto';
    }
  }
  
  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }
  
  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }
});