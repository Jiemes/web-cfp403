/**
 * Archivo principal JS - web-cfp403 - Reingeniería Estructural
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

    // --- 3. Base de Datos Falsa para Fichas Técnicas de Cursos ---
    const coursesData = {
        'ia': {
            title: 'Habilidades Digitales e Inteligencia Artificial',
            img: 'img/curso-web.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Mar y Jue, 18:00 a 21:00',
            perfil: 'Aprenderás a integrar herramientas de IA (ChatGPT, Midjourney) en flujos de trabajo diarios, automatizar tareas y dominar competencias digitales clave para el empleo moderno.',
            requisitos: ['DNI y fotocopia', 'Estudios primarios completos', 'Conocimientos básicos de PC']
        },
        'marketing': {
            title: 'Diseño y Marketing Digital',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 17:30 a 21:00',
            perfil: 'Domina las herramientas de diseño gráfico, creación de contenido para redes sociales, manejo de campañas publicitarias y estrategias de e-commerce.',
            requisitos: ['DNI y fotocopia', 'Estudios secundarios (en curso o completos)']
        },
        'software': {
            title: 'Desarrollo de Software y Videojuegos',
            img: 'img/curso-web.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Año',
            horario: 'Mar, Jue y Vie, 18:00 a 21:30',
            perfil: 'Programación Full Stack y game design. Crea aplicaciones web, bases de datos y desarrolla prototipos de videojuegos 2D/3D utilizando motores actuales.',
            requisitos: ['DNI y fotocopia', 'Lógica matemática básica recomendada']
        },
        'ingles': {
            title: 'Inglés Aplicado al Mundo Digital',
            img: 'img/curso-web.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Sábados, 09:00 a 13:00',
            perfil: 'Inglés técnico focalizado en la interpretación de documentación de software, interfaces de usuario y comunicación en entornos IT globales.',
            requisitos: ['DNI y fotocopia']
        },
        'comedor': {
            title: 'Cocinero/a para Comedor Escolar',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 14:00 a 17:30',
            perfil: 'Preparación de menús masivos equilibrados, cumplimiento estricto de normas de bromatología e higiene, y gestión de raciones para instituciones educativas.',
            requisitos: ['DNI y fotocopia', 'Libreta Sanitaria']
        },
        'pastas': {
            title: 'Elaborador/a de Pastas Saludables',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Mar y Jue, 14:00 a 17:00',
            perfil: 'Técnicas de elaboración artesanal de pastas frescas secas y rellenas incorporando vegetales, harinas alternativas y principios nutricionales.',
            requisitos: ['DNI y fotocopia', 'Libreta Sanitaria']
        },
        'eventos': {
            title: 'Organizador/a de Eventos',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Viernes, 17:00 a 21:00',
            perfil: 'Planificación, presupuesto, protocolo y coordinación logística integral para eventos corporativos y sociales.',
            requisitos: ['DNI y fotocopia']
        },
        'limpieza': {
            title: 'Limpieza Institucional',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Lun y Mié, 09:00 a 12:00',
            perfil: 'Manejo de productos domisanitarios, protocolos de desinfección en hospitales, escuelas y oficinas gubernamentales, y bioseguridad.',
            requisitos: ['DNI y fotocopia']
        },
        'horticola': {
            title: 'Producción Hortícola y Cultivos',
            img: 'img/curso-web.jpg',
            sede: 'Vivero Municipal (Prácticas)',
            duracion: '1 Año',
            horario: 'Mar y Jue, 09:00 a 13:00',
            perfil: 'Diseño de huertas agroecológicas, rotación de cultivos, sistemas de riego y manejo sustentable de plagas orientado a la soberanía alimentaria.',
            requisitos: ['DNI y fotocopia']
        },
        'hongos': {
            title: 'Cultivador/a de Hongos Comestibles',
            img: 'img/curso-web.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Viernes, 14:00 a 17:00',
            perfil: 'Técnicas de inoculación, incubación y fructificación de gírgolas y otros hongos comestibles sobre sustratos reciclados (economía circular).',
            requisitos: ['DNI y fotocopia']
        },
        'textil': {
            title: 'Confección y Emprendimientos Textiles',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 14:00 a 17:30',
            perfil: 'Manejo de máquinas de coser industriales (recta, overlock), moldería básica, corte y estrategias para lanzar tu propia marca de ropa o uniformes.',
            requisitos: ['DNI y fotocopia']
        }
    };

    // --- 4. Lógica de Slide-over Modal (Fichas de Cursos) ---
    const modal = document.getElementById('course-slideover');
    const closeBtn = document.getElementById('close-modal');
    const courseCards = document.querySelectorAll('.course-card');
    const body = document.body;

    if (modal && closeBtn && courseCards.length > 0) {
        
        function openModal(courseId) {
            const data = coursesData[courseId];
            if (!data) return;

            // Poblar datos
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-img').src = data.img;
            document.getElementById('modal-sede').textContent = data.sede;
            document.getElementById('modal-duracion').textContent = data.duracion;
            document.getElementById('modal-horario').textContent = data.horario;
            document.getElementById('modal-perfil').textContent = data.perfil;
            
            // Requisitos lista
            const reqList = document.getElementById('modal-requisitos');
            reqList.innerHTML = '';
            data.requisitos.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req;
                reqList.appendChild(li);
            });

            // Actualizar CTA enlace
            document.getElementById('modal-register-btn').href = `register.html?curso=${courseId}`;

            // Mostrar modal
            modal.classList.add('active');
            body.classList.add('no-scroll'); // Prevenir scroll del body en móviles
        }

        function closeModal() {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        }

        // Attach events
        courseCards.forEach(card => {
            card.addEventListener('click', () => {
                const courseId = card.getAttribute('data-course-id');
                openModal(courseId);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        
        // Cerrar al hacer clic en el overlay (fuera del panel)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
