/**
 * Módulo de Fichas Técnicas de Cursos
 * web-cfp403
 */

document.addEventListener('DOMContentLoaded', () => {

    const coursesData = {
        'ia': {
            title: 'en Habilidades Digitales e I.A.',
            img: 'img/curso-web.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Mar y Jue, 18:00 a 21:00',
            perfil: 'Aprenderás a integrar herramientas de IA en flujos de trabajo diarios, automatizar tareas y dominar competencias digitales clave.',
            requisitos: ['DNI y fotocopia', 'Estudios primarios completos', 'Conocimientos básicos de PC'],
            highlight: null
        },
        'marketing': {
            title: 'en Diseño Gráfico y Marketing Digital',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 17:30 a 21:00',
            perfil: 'Domina las herramientas de diseño gráfico, creación de contenido para redes sociales, manejo de campañas publicitarias y estrategias de e-commerce.',
            requisitos: ['DNI y fotocopia', 'Estudios secundarios (en curso o completos)'],
            highlight: null
        },
        'software': {
            title: 'en Desarrollo de Software y Videojuegos',
            img: 'img/programacion.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: 'Inicia el 2 de marzo y finaliza el 15 de diciembre',
            horario: 'Cursada Híbrida (Online Asincrónico y Presencial a definir)',
            perfil: 'Puestos de Programador, Desarrollador de Softwares, Equipos de Videojuegos y Freelance.',
            requisitos: ['Mayor de 16 años', 'Estudios secundarios finalizados o en curso'],
            highlight: 'La integración de Programación en Python, Construcción de Bases de Datos, Diseño y Programación de Videojuegos, e Incorporación de herramientas de Inteligencia Artificial.'
        },
        'web': {
            title: 'en Desarrollo Web y Mobile',
            img: 'img/curso-web.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Año',
            horario: 'Mar y Jue, 18:00 a 21:00',
            perfil: 'Creación de aplicaciones web y móviles modernas utilizando las últimas tecnologías y frameworks del mercado.',
            requisitos: ['DNI y fotocopia', 'Estudios secundarios (en curso o completos)'],
            highlight: null
        },
        'horticola': {
            title: 'en Producción Hortícola y Cultivos Especializados',
            img: 'img/curso-web.jpg',
            sede: 'Vivero Municipal (Prácticas)',
            duracion: '1 Año',
            horario: 'Mar y Jue, 09:00 a 13:00',
            perfil: 'Diseño de huertas agroecológicas, rotación de cultivos, sistemas de riego y manejo sustentable de plagas orientado a la soberanía alimentaria.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'textil': {
            title: 'en Confección y Emprendimientos Textiles',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Lun y Mié, 14:00 a 17:30',
            perfil: 'Manejo de máquinas de coser industriales, moldería básica, corte y estrategias para lanzar tu propia marca de ropa o uniformes.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'eventos': {
            title: 'en Organización de Eventos',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede Central (Calle 32)',
            duracion: '1 Cuatrimestre',
            horario: 'Viernes, 17:00 a 21:00',
            perfil: 'Planificación, presupuesto, protocolo y coordinación logística integral para eventos corporativos y sociales.',
            requisitos: ['DNI y fotocopia'],
            highlight: null
        },
        'gastronomia': {
            title: 'en Gastronomía',
            img: 'img/curso-diseno.jpg',
            sede: 'Sede 1 (Calle 31)',
            duracion: '1 Año',
            horario: 'Mar y Jue, 14:00 a 17:30',
            perfil: 'Técnicas culinarias profesionales, manejo seguro de alimentos, pastelería y planificación de menú.',
            requisitos: ['DNI y fotocopia', 'Libreta Sanitaria'],
            highlight: null
        }
    };

    window.cfpCoursesData = coursesData; // Export para profile.html

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

            // Lógica del CTA de inscripción
            const ctaBtn = document.getElementById('modal-register-btn');
            
            // Limpiamos event listeners anteriores clonando el nodo
            const newCtaBtn = ctaBtn.cloneNode(true);
            ctaBtn.parentNode.replaceChild(newCtaBtn, ctaBtn);
            
            newCtaBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Chequear auth mediante Firebase
                const user = window.authFirebase ? window.authFirebase.currentUser : null;
                
                if (user) {
                    // Usuario logueado: confirmar inscripción
                    if(confirm(`¿Estás seguro de que quieres anotarte en ${data.title}?`)) {
                        try {
                            const userRef = window.db.collection('users').doc(user.uid);
                            const doc = await userRef.get();
                            if(doc.exists) {
                                const userData = doc.data();
                                const currentCursos = userData.cursos || [];
                                
                                if(!currentCursos.includes(courseId)) {
                                    currentCursos.push(courseId);
                                    await userRef.update({ cursos: currentCursos });
                                    alert('¡Inscripción confirmada! Revisa tu panel.');
                                    window.location.href = 'profile.html';
                                } else {
                                    alert('Ya estás inscripto en este curso.');
                                    window.location.href = 'profile.html';
                                }
                            }
                        } catch (error) {
                            console.error("Error al inscribir:", error);
                            alert("Hubo un error al procesar tu inscripción.");
                        }
                    }
                } else {
                    // Usuario no logueado: ir a register
                    window.location.href = `register.html?curso=${courseId}`;
                }
            });

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
