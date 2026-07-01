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
            "en Programación",
            "en Inteligencia Artificial",
            "en Robótica",
            "y Oficios del Futuro"
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
});
