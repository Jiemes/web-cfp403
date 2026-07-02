/**
 * director.js - Lógica CRUD para el Panel del Superadmin
 */

document.addEventListener('DOMContentLoaded', () => {
    // Menú de navegación
    const btnCursos = document.getElementById('nav-cursos');
    const btnMigracion = document.getElementById('nav-migracion');
    const secCursos = document.getElementById('sec-cursos');
    const secMigracion = document.getElementById('sec-migracion');

    btnCursos.addEventListener('click', (e) => {
        e.preventDefault();
        btnMigracion.classList.remove('active');
        btnCursos.classList.add('active');
        secMigracion.style.display = 'none';
        secCursos.style.display = 'block';
    });

    btnMigracion.addEventListener('click', (e) => {
        e.preventDefault();
        btnCursos.classList.remove('active');
        btnMigracion.classList.add('active');
        secCursos.style.display = 'none';
        secMigracion.style.display = 'block';
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        window.authFirebase.signOut().then(() => window.location.replace('index.html'));
    });

    // Cargar Cursos
    loadCursos();

    // Modal de Cursos
    const modalCurso = document.getElementById('modal-curso');
    const formCurso = document.getElementById('form-curso');
    
    document.getElementById('btn-add-curso').addEventListener('click', () => {
        formCurso.reset();
        document.getElementById('curso-id').value = '';
        document.getElementById('modal-curso-title').textContent = 'Crear Nuevo Curso';
        modalCurso.classList.add('active');
    });

    formCurso.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('curso-id').value;
        const cursoData = {
            title: document.getElementById('c-title').value,
            sede: document.getElementById('c-sede').value,
            horario: document.getElementById('c-horario').value,
            perfil: document.getElementById('c-perfil').value,
            img: document.getElementById('c-img').value,
            fecha_inicio: document.getElementById('c-inicio').value || null,
            fecha_fin: document.getElementById('c-fin').value || null,
            requisitos: ['DNI', 'Estudios Secundarios'], // Por defecto temporal
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            if (id) {
                await window.db.collection('cursos').doc(id).update(cursoData);
            } else {
                cursoData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await window.db.collection('cursos').add(cursoData);
            }
            modalCurso.classList.remove('active');
            loadCursos();
            alert('Curso guardado con éxito.');
        } catch (error) {
            console.error("Error guardando curso:", error);
            alert('Hubo un error al guardar.');
        }
    });

    // Script de Migración (Carga inicial desde cursos.js hardcoded)
    document.getElementById('btn-migrate-courses').addEventListener('click', async () => {
        if(!confirm('¿Estás seguro de ejecutar la migración? Solo debes hacerlo si la tabla está vacía.')) return;
        
        // Data estática heredada
        const coursesData = {
            'ia': { title: 'en Habilidades Digitales e I.A.', img: 'img/curso-web.jpg', sede: 'Sede Central (Calle 32)', horario: 'Mar y Jue, 18:00 a 21:00', perfil: 'Aprenderás a integrar herramientas de IA en flujos de trabajo diarios, automatizar tareas y dominar competencias digitales clave.', requisitos: ['DNI y fotocopia', 'Estudios primarios completos', 'Conocimientos básicos de PC'] },
            'marketing': { title: 'en Diseño Gráfico y Marketing Digital', img: 'img/curso-diseno.jpg', sede: 'Sede Central (Calle 32)', horario: 'Lun y Mié, 17:30 a 21:00', perfil: 'Domina las herramientas de diseño gráfico, creación de contenido para redes sociales, manejo de campañas publicitarias y estrategias de e-commerce.', requisitos: ['DNI y fotocopia', 'Estudios secundarios (en curso o completos)'] },
            'software': { title: 'en Desarrollo de Software y Videojuegos', img: 'img/programacion.jpg', sede: 'Sede Central (Calle 32)', horario: 'Cursada Híbrida (Online Asincrónico y Presencial a definir)', perfil: 'Puestos de Programador, Desarrollador de Softwares, Equipos de Videojuegos y Freelance.', requisitos: ['Mayor de 16 años', 'Estudios secundarios finalizados o en curso'] },
            'web': { title: 'en Desarrollo Web y Mobile', img: 'img/curso-web.jpg', sede: 'Sede Central (Calle 32)', horario: 'Mar y Jue, 18:00 a 21:00', perfil: 'Programación frontend y backend para páginas web y aplicaciones móviles.', requisitos: ['Mayor de 16 años', 'Estudios secundarios (en curso o completos)', 'Conocimientos básicos de PC e internet'] },
            'horticultura': { title: 'en Producción Hortícola y Cultivos Especializados', img: 'img/curso-huerta.jpg', sede: 'Sede Agropecuaria', horario: 'Mar, Mié y Jue, 13:30 a 17:00', perfil: 'Trabajador Hortícola, Productor de bioinsumos y Operador de sistemas de riego.', requisitos: ['DNI y fotocopia', 'Estudios primarios completos'] },
            'textil': { title: 'en Confección y Emprendimientos Textiles', img: 'img/curso-textil.jpg', sede: 'Sede Central (Calle 32)', horario: 'Lun y Mié, 14:00 a 17:30', perfil: 'Diseño, patronaje y confección de indumentaria. Armado de talleres textiles.', requisitos: ['DNI y fotocopia', 'Estudios primarios completos'] },
            'eventos': { title: 'en Organización de Eventos', img: 'img/curso-eventos.jpg', sede: 'Sede Central (Calle 32)', horario: 'Sábados, 09:00 a 13:00', perfil: 'Planificación integral de eventos corporativos y sociales, ceremonial y protocolo.', requisitos: ['DNI y fotocopia', 'Estudios secundarios completos'] },
            'gastronomia': { title: 'en Gastronomía', img: 'img/curso-gastronomia.jpg', sede: 'Cocina Escuela', horario: 'Lun y Mié, 17:00 a 21:00', perfil: 'Técnicas culinarias profesionales, manipulación de alimentos y pastelería básica.', requisitos: ['DNI y fotocopia', 'Estudios primarios completos', 'Libreta Sanitaria'] }
        };

        let count = 0;
        for (const [key, data] of Object.entries(coursesData)) {
            // Guardamos usando la key como ID del documento en Firestore
            await window.db.collection('cursos').doc(key).set({
                ...data,
                inscriptos: [], // Array vacío por defecto
                migrated: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            count++;
        }
        
        alert(`¡Migración exitosa! Se cargaron ${count} cursos a Firestore.`);
        loadCursos();
    });
});

async function loadCursos() {
    const tbody = document.getElementById('cursos-tbody');
    tbody.innerHTML = '<tr><td colspan="4">Cargando cursos...</td></tr>';
    
    try {
        const snapshot = await window.db.collection('cursos').get();
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay cursos cargados. Usa la herramienta de migración.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border)';
            tr.innerHTML = `
                <td style="padding: 1rem;"><strong>${data.title}</strong><br><small class="text-gray">${data.sede}</small></td>
                <td style="padding: 1rem;">${data.fecha_inicio || 'No definida'}</td>
                <td style="padding: 1rem;">-</td>
                <td style="padding: 1rem;">
                    <button class="btn btn-outline btn-sm" onclick="editCurso('${doc.id}')">Editar</button>
                    <button class="btn btn-outline btn-sm" style="color: var(--color-danger); border-color: var(--color-danger);" onclick="deleteCurso('${doc.id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error leyendo cursos:", error);
        tbody.innerHTML = '<tr><td colspan="4">Error al cargar datos.</td></tr>';
    }
}

window.editCurso = async function(id) {
    try {
        const doc = await window.db.collection('cursos').doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('curso-id').value = id;
            document.getElementById('c-title').value = data.title;
            document.getElementById('c-sede').value = data.sede;
            document.getElementById('c-horario').value = data.horario;
            document.getElementById('c-perfil').value = data.perfil;
            document.getElementById('c-img').value = data.img;
            document.getElementById('c-inicio').value = data.fecha_inicio || '';
            document.getElementById('c-fin').value = data.fecha_fin || '';
            
            document.getElementById('modal-curso-title').textContent = 'Editar Curso';
            document.getElementById('modal-curso').classList.add('active');
        }
    } catch (error) {
        console.error("Error al obtener curso para editar:", error);
    }
};

window.deleteCurso = async function(id) {
    if (confirm('¿Estás seguro de eliminar este curso PERMANENTEMENTE de la plataforma?')) {
        try {
            await window.db.collection('cursos').doc(id).delete();
            loadCursos();
        } catch (error) {
            console.error("Error eliminando:", error);
        }
    }
};
