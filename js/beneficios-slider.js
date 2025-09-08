/**
 * Beneficios Slider - Convierte la sección de beneficios en un slider para dispositivos móviles
 * Con diseño "peek-a-boo" que muestra parcialmente las tarjetas adyacentes
 */
document.addEventListener('DOMContentLoaded', () => {
  // Constantes
  const MOBILE_BREAKPOINT = 1100;
  const ACTIVE_DOT_COLOR = '#b57f50';
  const INACTIVE_DOT_COLOR = '#ddd';
  const CARD_WIDTH_PERCENTAGE = 80; // Ancho de la tarjeta principal (%)
  const CARD_GAP = 16; // Espacio entre tarjetas (px)
  
  // Elementos principales
  const container = document.querySelector('.beneficios-nuevo');
  const slides = Array.from(document.querySelectorAll('.beneficio-fila'));
  
  // Variables de estado
  let isSliderActive = false;
  let currentIndex = 0;
  let sliderWrapper = null;
  let dotsContainer = null;
  let originalStyles = {
    container: {},
    slides: []
  };
  let hasPlayedHintAnimation = false;
  
  // Inicialización
  init();
  
  function init() {
    // Guardar estilos originales
    saveOriginalStyles();
    
    // Verificar si debemos activar el slider
    checkScreenSize();
    
    // Listener para redimensión de ventana
    window.addEventListener('resize', checkScreenSize);
    
    // Configurar observador para detectar cuando la sección es visible
    setupIntersectionObserver();
  }
  
  function setupIntersectionObserver() {
    // Solo configurar si IntersectionObserver está disponible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && isSliderActive && !hasPlayedHintAnimation) {
            // La sección es visible, iniciar animación después de un pequeño retraso
            setTimeout(playHintAnimation, 800);
            hasPlayedHintAnimation = true;
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2 // Activar cuando al menos 20% del elemento es visible
      });
      
      observer.observe(container);
    }
  }
  
  function playHintAnimation() {
    if (!sliderWrapper || currentIndex !== 0) return;
    
    // Usar una transición más larga y una curva más suave
    sliderWrapper.style.transition = 'transform 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
    
    // Movimiento sutil hacia la derecha
    sliderWrapper.style.transform = 'translateX(10px)';
    
    // Secuencia suave
    setTimeout(() => {
      // Movimiento más sutil hacia la izquierda
      sliderWrapper.style.transform = 'translateX(-5%)';
      
      setTimeout(() => {
        // Movimiento suave de retorno
        sliderWrapper.style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        sliderWrapper.style.transform = 'translateX(0)';
        
        // Restaurar la transición normal después de completar
        setTimeout(() => {
          sliderWrapper.style.transition = 'transform 0.3s ease';
        }, 1500);
      }, 1000);
    }, 800);
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
      hasPlayedHintAnimation = false; // Resetear para que la animación se muestre si el usuario cambia a móvil
    }
  }
  
  function activateSlider() {
    if (isSliderActive) return;
    
    // 1. Limpiar cualquier padding o margin previo
    container.style.margin = '0';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.padding = '0';
    
    // 2. Crear wrapper con ancho total para todas las tarjetas
    sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('beneficios-slider-wrapper');
    
    // 3. Configurar cada slide
    slides.forEach((slide) => {
      // Establecer un ancho fijo en porcentaje para cada tarjeta
      const slideWidth = `${CARD_WIDTH_PERCENTAGE}%`;
      
      // Resetear todos los estilos que puedan afectar al layout
      slide.style.flex = 'none';
      slide.style.width = slideWidth;
      slide.style.margin = '0';
      slide.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      slide.style.borderRadius = '16px';
      slide.style.overflow = 'hidden';
      
      // Crear un contenedor para cada tarjeta con el padding adecuado
      const slideContainer = document.createElement('div');
      slideContainer.style.cssText = `
        padding: 0 ${CARD_GAP/2}px;
        box-sizing: border-box;
      `;
      
      // Mover la tarjeta al contenedor
      container.removeChild(slide);
      slideContainer.appendChild(slide);
      sliderWrapper.appendChild(slideContainer);
    });
    
    // Aplicar estilos al wrapper
    sliderWrapper.style.cssText = `
      display: flex;
      transition: transform 0.3s ease;
      width: ${slides.length * 100}%;
      position: relative;
      padding: 0;
    `;
    
    // 4. Añadir wrapper al contenedor
    container.appendChild(sliderWrapper);
    
    // 5. Crear navegación
    createNavigation();
    
    // 6. Configurar eventos táctiles
    setupTouchEvents();
    
    isSliderActive = true;
    
    // Esperar a que el DOM se actualice y luego ir al slide inicial
    setTimeout(() => {
      goToSlide(0, false);
    }, 50);
  }
  
  function deactivateSlider() {
    if (!isSliderActive) return;
    
    // 1. Extraer slides de sus contenedores
    const slideContainers = sliderWrapper.querySelectorAll('div');
    slideContainers.forEach((slideContainer, index) => {
      const slide = slideContainer.querySelector('.beneficio-fila');
      if (slide) {
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
        slideContainer.removeChild(slide);
        container.appendChild(slide);
      }
    });
    
    // 2. Eliminar wrapper
    if (sliderWrapper && sliderWrapper.parentNode === container) {
      container.removeChild(sliderWrapper);
    }
    
    // 3. Eliminar navegación
    if (dotsContainer && dotsContainer.parentNode === container) {
      container.removeChild(dotsContainer);
    }
    
    // 4. Restaurar estilos del contenedor
    const originalContainerStyle = originalStyles.container;
    container.style.overflow = originalContainerStyle.overflow;
    container.style.padding = originalContainerStyle.padding;
    container.style.position = originalContainerStyle.position;
    container.style.margin = '2rem auto 4rem';
    
    // 5. Remover eventos táctiles
    removeTouchEvents();
    
    isSliderActive = false;
  }
  
  function createNavigation() {
    // Crear puntos de navegación
    dotsContainer = document.createElement('div');
    dotsContainer.classList.add('beneficios-slider-dots');
    dotsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 5px 0 4rem; /* Reducido arriba (5px) y aumentado abajo (30px) */
      position: relative;
      z-index: 10;
      margin-top: -10px; /* Acerca aún más a las tarjetas */
    `;
    
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
      
      dot.addEventListener('click', () => goToSlide(index, true));
      dotsContainer.appendChild(dot);
    });
    
    container.appendChild(dotsContainer);
  }
  
  // Variables para eventos táctiles
  let touchStartX = 0;
  let touchEndX = 0;
  let touchMoved = false;
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchMoved = false;
  }
  
  function handleTouchMove() {
    touchMoved = true;
  }
  
  function handleTouchEnd(e) {
    if (!touchMoved) return;
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 30; // Umbral para considerar un swipe
    
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
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  function removeTouchEvents() {
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('touchend', handleTouchEnd);
  }
  
  function goToSlide(index, animate = true) {
    if (!isSliderActive) return;
    
    // Asegurar que el índice está dentro de los límites
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    currentIndex = index;
    
    // Cálculo mucho más simple: simplemente dividimos el ancho total entre el número de slides
    // y multiplicamos por el índice actual
    const percentage = (100 / slides.length) * index;
    
    if (animate) {
      sliderWrapper.style.transition = 'transform 0.3s ease';
    } else {
      sliderWrapper.style.transition = 'none';
    }
    
    sliderWrapper.style.transform = `translateX(-${percentage}%)`;
    
    if (!animate) {
      setTimeout(() => {
        sliderWrapper.style.transition = 'transform 0.3s ease';
      }, 50);
    }
    
    // Actualizar los puntos de navegación
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.beneficios-slider-dot');
      dots.forEach((dot, i) => {
        dot.style.backgroundColor = i === index ? ACTIVE_DOT_COLOR : INACTIVE_DOT_COLOR;
      });
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