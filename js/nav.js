// Script para controlar el menú de navegación responsive

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.querySelector('.topband-menu-toggle');
    const nav = document.querySelector('.topband-nav');
    const navLinks = document.querySelectorAll('.topband-nav > a, .topband-nav > .nav-dropdown > .nav-dropdown-toggle');

    // Función para abrir/cerrar el menú móvil
    function toggleMenu() {
        // Toggle para abrir/cerrar el menú
        if (!nav.classList.contains('open')) {
            // Abrir menú
            menuToggle.classList.add('active'); // Añadir clase active al abrir
            nav.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevenir scroll

            // Accesibilidad: Cambiar el aria-expanded
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            // Cerrar menú
            menuToggle.classList.remove('active'); // Quitar clase active al cerrar

            // Efecto de desvanecimiento al cerrar
            nav.querySelectorAll('a').forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(-5px)';
            });

            // Pequeño retraso antes de cerrar el menú
            setTimeout(() => {
                nav.classList.remove('open');
                document.body.style.overflow = ''; // Restaurar scroll

                // Restaurar estilos para próxima apertura
                setTimeout(() => {
                    nav.querySelectorAll('a').forEach(link => {
                        link.style.opacity = '';
                        link.style.transform = '';
                    });
                }, 300);
            }, 200);

            // Accesibilidad: Cambiar el aria-expanded
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);

        // Soporte para teclado (accesibilidad)
        menuToggle.addEventListener('keydown', function(event) {
            // Activar con Enter o Espacio
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }
        });
    }

    // Dropdown de Tratamientos en móvil: toggle al clicar el toggle
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    const navDropdown = document.querySelector('.nav-dropdown');
    if (dropdownToggle && navDropdown) {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 600) {
                e.preventDefault();
                e.stopPropagation();
                navDropdown.classList.toggle('open');
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 600 && nav.classList.contains('open')) {
                // Solo cerrar si no es el toggle del dropdown
                if (!this.classList.contains('nav-dropdown-toggle')) {
                    toggleMenu();
                }
            }

            // Añadir clase active solo a links directos del nav (no del dropdown)
            if (!this.closest('.nav-dropdown-menu')) {
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('open') &&
            !nav.contains(event.target) &&
            menuToggle && !menuToggle.contains(event.target)) {
            toggleMenu();
        }
    });

    // Ajustar menú al redimensionar ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 600 && nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });

    // Manejar scroll para resaltar sección activa
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        // Determinar qué sección está activa
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.id || section.classList[0];

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Eliminar 'active' de todos los enlaces directos del nav
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Añadir 'active' al enlace correspondiente
                const activeLink = document.querySelector(`.topband-nav > a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });

    // Interceptar clics en los enlaces del menú para un scroll suave y preciso
    // Solo aplica a enlaces de ancla (href que empieza por #)
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Si no es un ancla interna, dejar navegación normal
            if (!href || !href.startsWith('#')) return;

            e.preventDefault(); // Prevenir comportamiento por defecto

            const targetId = href.substring(1); // Obtener id sin #
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Calcular posición exacta considerando la altura de la topband
                const topbandHeight = document.querySelector('.topband').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - topbandHeight;

                // Scroll suave a la posición calculada
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Actualizar la URL sin causar otro scroll
                history.pushState(null, null, `#${targetId}`);

                // Actualizar clase active en el menú
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');

                // Cerrar menú móvil si está abierto
                if (window.innerWidth <= 600 && nav.classList.contains('open')) {
                    toggleMenu();
                }
            }
        });
    });
});
