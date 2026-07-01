/**
 * Archivo principal JS - web-cfp403
 * Contiene lógica de Splash Screen y Navegación Móvil
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Splash Screen Animation ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // En producción real, la duración depende de la carga real de assets.
        // Aquí simulamos un retardo para mostrar la animación.
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 600); // 600ms match CSS transition
        }, 1200);
    }

    // --- 2. Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace (para móviles)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

});
