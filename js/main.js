/**
 * Archivo principal JS - web-cfp403
 * Animaciones Globales, Typewriter y Carruseles
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Splash Screen Animation ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 600);
        }, 1200);
    }

    // --- 2. Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 3. Hero Background Carousel Fade ---
    const bgLayers = document.querySelectorAll('.hero-bg-layer');
    if (bgLayers.length > 0) {
        let currentBgIndex = 0;
        setInterval(() => {
            bgLayers[currentBgIndex].classList.remove('slide-active');
            currentBgIndex = (currentBgIndex + 1) % bgLayers.length;
            bgLayers[currentBgIndex].classList.add('slide-active');
        }, 5000); // Change image every 5 seconds
    }

    // --- 4. Hero Typewriter Effect ---
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const words = [
            "en Habilidades Digitales e I.A.",
            "en Diseño Gráfico y Marketing Digital",
            "en Desarrollo de Software y Videojuegos",
            "en Desarrollo Web y Mobile",
            "en Producción Hortícola y Cultivos Especializados",
            "en Confección y Emprendimientos Textiles",
            "en Organización de Eventos",
            "en Gastronomía"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50; // Faster deleting
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100; // Normal typing speed
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingDelay = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingDelay = 500; // Pause before new word
            }
            
            setTimeout(type, typingDelay);
        }
        
        // Start typing effect after splash screen (delay approx 2s)
        setTimeout(type, 2000);
    }

    // --- 5. Carruseles Interactivos (Desktop Drag, Rueda, Flechas y Puntos) ---
    function setupInteractiveCarousel({
        carouselId,
        prevBtnId,
        nextBtnId,
        dotsId,
        itemSelector,
        autoPlay = false,
        interval = 5500
    }) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const dotsContainer = document.getElementById(dotsId);
        const items = carousel.querySelectorAll(itemSelector);

        if (!items.length) return;

        let isDown = false;
        let startX = 0;
        let scrollStartLeft = 0;
        let hasMoved = false;
        let autoPlayTimer = null;

        // Obtener índice actual más cercano
        function getCurrentIndex() {
            const sl = carousel.scrollLeft;
            let closestIdx = 0;
            let minDiff = Infinity;
            items.forEach((item, idx) => {
                const itemPos = item.offsetLeft - carousel.offsetLeft;
                const diff = Math.abs(itemPos - sl);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = idx;
                }
            });
            return closestIdx;
        }

        // Actualizar estado de botones y dots
        function updateUIState() {
            const sl = carousel.scrollLeft;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            if (prevBtn) {
                prevBtn.disabled = sl <= 6;
            }
            if (nextBtn) {
                nextBtn.disabled = sl >= maxScroll - 6;
            }

            if (dotsContainer) {
                const activeIdx = getCurrentIndex();
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeIdx);
                });
            }
        }

        // Mover a un índice específico
        function scrollToIndex(idx) {
            if (idx < 0) idx = 0;
            if (idx >= items.length) idx = items.length - 1;
            const targetPos = items[idx].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({
                left: targetPos,
                behavior: 'smooth'
            });
        }

        // Eventos de botones
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const curIdx = getCurrentIndex();
                scrollToIndex(curIdx - 1);
                restartAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const curIdx = getCurrentIndex();
                scrollToIndex(curIdx + 1);
                restartAutoPlay();
            });
        }

        // Eventos de puntos indicadores
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                    if (!isNaN(targetIdx)) {
                        scrollToIndex(targetIdx);
                        restartAutoPlay();
                    }
                });
            });
        }

        // --- Drag con Mouse para PC (Desktop Swipe) ---
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            carousel.classList.add('is-dragging');
            startX = e.pageX - carousel.offsetLeft;
            scrollStartLeft = carousel.scrollLeft;
            stopAutoPlay();
        });

        const stopDragging = () => {
            if (!isDown) return;
            isDown = false;
            carousel.classList.remove('is-dragging');
            setTimeout(() => {
                updateUIState();
            }, 100);
            startAutoPlay();
        };

        window.addEventListener('mouseup', stopDragging);
        carousel.addEventListener('mouseleave', () => {
            if (isDown) stopDragging();
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.4;
            if (Math.abs(walk) > 4) {
                hasMoved = true;
            }
            carousel.scrollLeft = scrollStartLeft - walk;
        });

        // Prevenir clics accidentales si hubo arrastre
        carousel.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        // --- Desplazamiento con rueda del ratón (Wheel) ---
        carousel.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                const canScrollLeft = carousel.scrollLeft > 6 && e.deltaY < 0;
                const canScrollRight = carousel.scrollLeft < maxScroll - 6 && e.deltaY > 0;

                if (canScrollLeft || canScrollRight) {
                    e.preventDefault();
                    carousel.scrollBy({
                        left: e.deltaY * 1.1,
                        behavior: 'smooth'
                    });
                    restartAutoPlay();
                }
            }
        }, { passive: false });

        // Listener de scroll para sincronizar UI
        let scrollDebounce;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollDebounce);
            scrollDebounce = setTimeout(updateUIState, 50);
        });

        // --- Autoplay ---
        function startAutoPlay() {
            if (!autoPlay || items.length <= 1) return;
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                const curIdx = getCurrentIndex();
                const nextIdx = (curIdx + 1) % items.length;
                scrollToIndex(nextIdx);
            }, interval);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function restartAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', () => {
            if (!isDown) startAutoPlay();
        });

        // Inicializar controles
        updateUIState();
        startAutoPlay();
    }

    // Inicializar carrusel de Agenda y Novedades (con autoplay de 5.5s)
    setupInteractiveCarousel({
        carouselId: 'novedades-carousel',
        prevBtnId: 'novedades-prev',
        nextBtnId: 'novedades-next',
        dotsId: 'novedades-dots',
        itemSelector: '.news-card',
        autoPlay: true,
        interval: 5500
    });

    // Inicializar carrusel de Entornos Formativos
    setupInteractiveCarousel({
        carouselId: 'entornos-carousel',
        prevBtnId: 'entornos-prev',
        nextBtnId: 'entornos-next',
        dotsId: 'entornos-dots',
        itemSelector: '.entorno-card',
        autoPlay: false
    });
});
