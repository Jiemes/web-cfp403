/**
 * cursos.js - Módulo Dinámico de Fichas Técnicas de Cursos desde Firestore
 */

document.addEventListener('DOMContentLoaded', () => {

    let coursesData = {}; // Cache local

    const grid = document.getElementById('dynamic-course-grid');
    const modal = document.getElementById('course-slideover');
    const closeBtn = document.getElementById('close-modal');
    const body = document.body;
    const highlightContainer = document.getElementById('modal-highlight-container');
    const highlightText = document.getElementById('modal-highlight-text');

    // 1. Cargar cursos desde Firestore
    async function fetchCourses() {
        if (!grid) return; // Solo ejecutar en index.html
        
        try {
            const snapshot = await window.db.collection('cursos').get();
            grid.innerHTML = '';
            
            if (snapshot.empty) {
                grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1;"><p>No hay cursos disponibles actualmente.</p></div>';
                return;
            }

            const today = new Date();

            snapshot.forEach(doc => {
                const data = doc.data();
                coursesData[doc.id] = data; // Cache
                
                // Expiración: Si la fecha fin ya pasó, no se renderiza en el catálogo
                if (data.fecha_fin) {
                    const endDate = new Date(data.fecha_fin);
                    if (endDate < today) return; // Curso expirado
                }

                // Generar tarjeta
                const card = document.createElement('div');
                card.className = 'card course-card touch-target filter-item';
                // Asignar categoría heurística para el filtro (esto en un crud real sería un campo)
                let cat = 'oficios';
                if(data.title.toLowerCase().includes('web') || data.title.toLowerCase().includes('software') || data.title.toLowerCase().includes('habilidades')) cat = 'tecnologia';
                if(data.title.toLowerCase().includes('gastronomía') || data.title.toLowerCase().includes('eventos')) cat = 'gastronomia';
                
                card.setAttribute('data-category', cat);
                card.setAttribute('data-course-id', doc.id);
                
                card.innerHTML = `
                    <img src="${data.img}" alt="Curso" class="card-img" onerror="this.src='img/curso-web.jpg'">
                    <div class="card-content">
                        <span class="badge" style="text-transform: capitalize;">${cat}</span>
                        <h3 class="mt-2">${data.title}</h3>
                        <div class="course-cta">Ver Detalles &rarr;</div>
                    </div>
                `;
                
                // Evento click
                card.addEventListener('click', () => {
                    openModal(doc.id, data);
                });

                grid.appendChild(card);
            });

            // Re-asignar filtros
            initFilters();

        } catch (error) {
            console.error("Error obteniendo cursos:", error);
            grid.innerHTML = '<div class="text-center text-danger" style="grid-column: 1/-1;"><p>Error al cargar el catálogo.</p></div>';
        }
    }

    // 2. Abrir Modal (Ficha Técnica)
    function openModal(courseId, data) {
        if (!modal) return;

        // Poblar datos generales
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-img').src = data.img;
        document.getElementById('modal-sede').textContent = data.sede;
        document.getElementById('modal-duracion').textContent = data.duracion || (data.fecha_inicio ? `Inicia: ${data.fecha_inicio}` : 'A definir');
        document.getElementById('modal-horario').textContent = data.horario;
        document.getElementById('modal-perfil').textContent = data.perfil;
        
        // Requisitos
        const reqList = document.getElementById('modal-requisitos');
        reqList.innerHTML = '';
        if (data.requisitos && Array.isArray(data.requisitos)) {
            data.requisitos.forEach(req => {
                const li = document.createElement('li');
                li.textContent = req;
                reqList.appendChild(li);
            });
        }

        // Highlight
        if (data.highlight) {
            highlightText.textContent = data.highlight;
            highlightContainer.style.display = 'block';
        } else {
            highlightContainer.style.display = 'none';
        }

        // Lógica del CTA de inscripción
        const ctaBtn = document.getElementById('modal-register-btn');
        const newCtaBtn = ctaBtn.cloneNode(true);
        ctaBtn.parentNode.replaceChild(newCtaBtn, ctaBtn);
        
        newCtaBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Chequear auth mediante Firebase
            const user = window.authFirebase ? window.authFirebase.currentUser : null;
            
            if (user) {
                // Validación 1: Obtener doc del usuario
                try {
                    const userRef = window.db.collection('users').doc(user.uid);
                    const docSnap = await userRef.get();
                    
                    if(docSnap.exists) {
                        const userData = docSnap.data();
                        const currentCursos = userData.cursos || [];
                        
                        // Validación 2: Límite de 4 cursos
                        if (currentCursos.length >= 4 && !currentCursos.includes(courseId)) {
                            alert('Restricción: No puedes inscribirte a más de 4 cursos simultáneamente.');
                            return;
                        }

                        if(confirm(`¿Estás seguro de que quieres anotarte en ${data.title}?`)) {
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
                    }
                } catch (error) {
                    console.error("Error al inscribir:", error);
                    alert("Hubo un error al procesar tu inscripción.");
                }
            } else {
                // Usuario no logueado: ir a register
                window.location.href = `register.html?curso=${courseId}`;
            }
        });

        modal.classList.add('active');
        body.classList.add('no-scroll');
    }

    function closeModal() {
        if(modal) {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // 3. Filtrado Dinámico
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const filterItems = document.querySelectorAll('.filter-item');

        if (filterBtns.length > 0 && filterItems.length > 0) {
            filterBtns.forEach(btn => {
                // Clonar para limpiar eventos previos por si aca
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    newBtn.classList.add('active');
                    const filterValue = newBtn.getAttribute('data-filter');

                    document.querySelectorAll('.filter-item').forEach(item => {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                                item.classList.remove('hide');
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'scale(1)';
                                }, 50);
                            } else {
                                item.classList.add('hide');
                            }
                        }, 300);
                    });
                });
            });
        }
    }

    // Ocultar catálogo público si es instructor
    if (window.authFirebase) {
        window.authFirebase.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const udoc = await window.db.collection('users').doc(user.uid).get();
                    if(udoc.exists && udoc.data().rol === 'instructor') {
                        const catSection = document.getElementById('cursos');
                        if (catSection) catSection.style.display = 'none'; // Ocultar catálogo en index si es instructor
                    }
                } catch(e) {}
            }
        });
    }

    // Iniciar fetch si estamos en index.html (donde existe el grid)
    if(grid) {
        // Necesitamos esperar a que firebase-config inicie window.db
        const checkDb = setInterval(() => {
            if (window.db) {
                clearInterval(checkDb);
                fetchCourses();
            }
        }, 50);
    }

    // Exportar variables globalmente (usado por profile para compatibilidad si hiciera falta)
    window.cfpCoursesData = coursesData;
});
