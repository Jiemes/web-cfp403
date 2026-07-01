/**
 * Módulo de Fichas Técnicas de Cursos
 * web-cfp403
 */

document.addEventListener('DOMContentLoaded', () => {

    const coursesData = {
        'ia': {
            title: 'Habilidades Digitales e Inteligencia Artificial',
            img: 'img/curso-web.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Mar y Jue, 18:00 a 21:00',
            perfil: 'Aprenderás a integrar herramientas de IA (ChatGPT, Midjourney) en flujos de trabajo diarios, automatizar tareas y dominar competencias digitales clave para el empleo moderno.',
            requisitos: ['DNI y fotocopia', 'Estudios primarios completos', 'Conocimientos básicos de PC'],
            highlight: null
        },
        'marketing': {
            title: 'Diseño y Marketing Digital',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 17:30 a 21:00',
            perfil: 'Domina las herramientas de diseño gráfico, creación de contenido para redes sociales, manejo de campañas publicitarias y estrategias de e-commerce.',
            requisitos: ['DNI y fotocopia', 'Estudios secundarios (en curso o completos)'],
            highlight: null
        },
        'software': {
            title: 'Desarrollo de Software y Videojuegos',
            img: 'img/programacion.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: 'Inicia el 2 de marzo y finaliza el 15 de diciembre',
            horario: 'Cursada Híbrida (Online Asincrónico y Presencial a definir)',
            perfil: 'Puestos de Programador, Desarrollador de Softwares, Equipos de Videojuegos y Freelance.',
            requisitos: ['Mayor de 16 años', 'Estudios secundarios finalizados o en curso'],
            highlight: 'La integración de Programación en Python, Construcción de Bases de Datos, Diseño y Programación de Videojuegos, e Incorporación de herramientas de Inteligencia Artificial.'
        },
        'ingles': {
            title: 'Inglés Aplicado al Mundo Digital',
            img: 'img/curso-web.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Sábados, 09:00 a 13:00',
            perfil: 'Inglés técnico focalizado en la interpretación de documentación de software, interfaces de usuario y comunicación en entornos IT globales.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'comedor': {
            title: 'Cocinero/a para Comedor Escolar',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 14:00 a 17:30',
            perfil: 'Preparación de menús masivos equilibrados, cumplimiento estricto de normas de bromatología e higiene, y gestión de raciones para instituciones educativas.',
            requisitos: ['DNI y fotocopia', 'Libreta Sanitaria'],
            highlight: null
        },
        'pastas': {
            title: 'Elaborador/a de Pastas Saludables',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Mar y Jue, 14:00 a 17:00',
            perfil: 'Técnicas de elaboración artesanal de pastas frescas secas y rellenas incorporando vegetales, harinas alternativas y principios nutricionales.',
            requisitos: ['DNI y fotocopia', 'Libreta Sanitaria'],
            highlight: null
        },
        'eventos': {
            title: 'Organizador/a de Eventos',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Viernes, 17:00 a 21:00',
            perfil: 'Planificación, presupuesto, protocolo y coordinación logística integral para eventos corporativos y sociales.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'limpieza': {
            title: 'Limpieza Institucional',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Lun y Mié, 09:00 a 12:00',
            perfil: 'Manejo de productos domisanitarios, protocolos de desinfección en hospitales, escuelas y oficinas gubernamentales, y bioseguridad.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'horticola': {
            title: 'Producción Hortícola y Cultivos',
            img: 'img/curso-web.jpg',
            sede: 'Vivero Municipal (Prácticas)',
            duracion: '1 Año',
            horario: 'Mar y Jue, 09:00 a 13:00',
            perfil: 'Diseño de huertas agroecológicas, rotación de cultivos, sistemas de riego y manejo sustentable de plagas orientado a la soberanía alimentaria.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'hongos': {
            title: 'Cultivador/a de Hongos Comestibles',
            img: 'img/curso-web.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Cuatrimestre',
            horario: 'Viernes, 14:00 a 17:00',
            perfil: 'Técnicas de inoculación, incubación y fructificación de gírgolas y otros hongos comestibles sobre sustratos reciclados (economía circular).',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'textil': {
            title: 'Confección y Emprendimientos Textiles',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 14:00 a 17:30',
            perfil: 'Manejo de máquinas de coser industriales (recta, overlock), moldería básica, corte y estrategias para lanzar tu propia marca de ropa o uniformes.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        }
    };

    const modal = document.getElementById('course-slideover');
    const closeBtn = document.getElementById('close-modal');
    const courseCards = document.querySelectorAll('.course-card');
    const body = document.body;
    const highlightContainer = document.getElementById('modal-highlight-container');
    const highlightText = document.getElementById('modal-highlight-text');

    if (modal && closeBtn && courseCards.length > 0) {
        
        function openModal(courseId) {
            const data = coursesData[courseId];
            if (!data) return;

            // Poblar datos generales
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-img').src = data.img;
            document.getElementById('modal-sede').textContent = data.sede;
            document.getElementById('modal-duracion').textContent = data.duracion;
            document.getElementById('modal-horario').textContent = data.horario;
            document.getElementById('modal-perfil').textContent = data.perfil;
            
            // Requisitos
            const reqList = document.getElementById('modal-requisitos');
            reqList.innerHTML = '';
            data.requisitos.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req;
                reqList.appendChild(li);
            });

            // Highlight (Bloque de alto contraste)
            if (data.highlight) {
                highlightText.textContent = data.highlight;
                highlightContainer.style.display = 'block';
            } else {
                highlightContainer.style.display = 'none';
            }

            // Actualizar CTA enlace
            document.getElementById('modal-register-btn').href = `register.html?curso=${courseId}`;

            // Mostrar modal
            modal.classList.add('active');
            body.classList.add('no-scroll');
        }

        function closeModal() {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        }

        courseCards.forEach(card => {
            card.addEventListener('click', () => {
                const courseId = card.getAttribute('data-course-id');
                openModal(courseId);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- 5. Lógica de Filtrado Dinámico de Cursos ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    if (filterBtns.length > 0 && filterItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover clase active de todos los botones
                filterBtns.forEach(b => b.classList.remove('active'));
                // Añadir clase active al botón clickeado
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                filterItems.forEach(item => {
                    // Animación de salida (opacidad 0, escala pequeña)
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';

                    setTimeout(() => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hide');
                            // Pequeño delay para que el display:block se aplique antes de animar
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.classList.add('hide');
                        }
                    }, 300); // Esperar que termine la transición CSS (0.3s)
                });
            });
        });
    }

});
