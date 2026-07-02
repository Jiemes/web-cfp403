/**
 * auth.js - Módulo de Autenticación con Firebase
 */

const AUTH_DOMAIN_SUFFIX = "@login.cfp403.edu.ar";

// ==============================================
// 1. Funciones de Sanitización y Formateo
// ==============================================
function capitalizeNames(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function sanitizeDNI(inputElement) {
    if (!inputElement) return;
    inputElement.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// ==============================================
// 2. Lógica del Stepper (Registro)
// ==============================================
function initStepper() {
    const nextBtn = document.getElementById('next-step-btn');
    const prevBtn = document.getElementById('prev-step-btn');
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const requiredFields = ['email', 'apellidos', 'nombres', 'dni', 'ciudad_res', 'direccion', 'telefono', 'estudios', 'archivo_dni'];
            let valid = true;
            requiredFields.forEach(id => {
                const el = document.getElementById(id);
                if (!el.value.trim()) {
                    el.style.borderColor = 'var(--color-danger)';
                    valid = false;
                } else {
                    el.style.borderColor = 'var(--color-border)';
                }
            });

            if (!valid) {
                alert('Por favor complete todos los campos obligatorios del Paso 1.');
                return;
            }

            document.getElementById('step-1-content').classList.remove('active');
            document.getElementById('step-2-content').classList.add('active');
            document.getElementById('step-indicator-1').classList.remove('active');
            document.getElementById('step-indicator-2').classList.add('active');
        });

        prevBtn.addEventListener('click', () => {
            document.getElementById('step-2-content').classList.remove('active');
            document.getElementById('step-1-content').classList.add('active');
            document.getElementById('step-indicator-2').classList.remove('active');
            document.getElementById('step-indicator-1').classList.add('active');
        });
    }
}

// ==============================================
// 3. Flujo de Registro (register.html)
// ==============================================
function initRegister() {
    const dniInput = document.getElementById('dni');
    const apellidosInput = document.getElementById('apellidos');
    const nombresInput = document.getElementById('nombres');
    const form = document.getElementById('register-form');

    sanitizeDNI(dniInput);
    
    if (apellidosInput) {
        apellidosInput.addEventListener('blur', (e) => {
            e.target.value = capitalizeNames(e.target.value);
        });
    }

    if (nombresInput) {
        nombresInput.addEventListener('blur', (e) => {
            e.target.value = capitalizeNames(e.target.value);
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dni = dniInput.value;
            const pass1 = document.getElementById('password').value;
            const pass2 = document.getElementById('password_confirm').value;

            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            // Crear email sintético para Auth
            const authEmail = `${dni}${AUTH_DOMAIN_SUFFIX}`;
            const realEmail = document.getElementById('email').value;

            try {
                // 1. Crear usuario en Firebase Auth
                const userCredential = await authFirebase.createUserWithEmailAndPassword(authEmail, pass1);
                const user = userCredential.user;

                // 2. Guardar datos en Firestore
                await db.collection('users').doc(user.uid).set({
                    dni: dni,
                    email: realEmail,
                    apellidos: apellidosInput.value,
                    nombres: nombresInput.value,
                    ciudad_res: document.getElementById('ciudad_res').value,
                    direccion: document.getElementById('direccion').value,
                    telefono: document.getElementById('telefono').value,
                    nacionalidad: document.getElementById('nacionalidad').value,
                    ciudad_nac: document.getElementById('ciudad_nac').value,
                    estudios: document.getElementById('estudios').value,
                    trabajo: document.getElementById('trabajo').value || 'NO',
                    salud: document.getElementById('salud').value || 'NO',
                    cursos: [], // Array de IDs de cursos
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                alert('¡Registro exitoso! Bienvenido al CFP 403.');
                
                const urlParams = new URLSearchParams(window.location.search);
                if(urlParams.get('curso')) {
                    window.location.href = `index.html?enroll=${urlParams.get('curso')}`;
                } else {
                    window.location.href = 'profile.html';
                }

            } catch (error) {
                console.error("Error en registro:", error);
                if (error.code === 'auth/email-already-in-use') {
                    alert('Ya existe una cuenta con ese DNI. Inicia sesión.');
                    window.location.href = 'login.html';
                } else {
                    alert('Error al registrar: ' + error.message);
                }
            }
        });
    }
}

// ==============================================
// 4. Flujo de Login y Recuperación (login.html)
// ==============================================
function initLogin() {
    const form = document.getElementById('login-form');
    
    if (form) {
        const dniInput = document.getElementById('login-dni');
        sanitizeDNI(dniInput);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dni = dniInput.value;
            const pass = document.getElementById('login-password').value;
            const authEmail = `${dni}${AUTH_DOMAIN_SUFFIX}`;
            
            try {
                await authFirebase.signInWithEmailAndPassword(authEmail, pass);
                window.location.href = 'profile.html';
            } catch (error) {
                console.error("Error en login:", error);
                alert('DNI o contraseña incorrectos.');
            }
        });
    }
}

// ==============================================
// 5. Perfil de Usuario (profile.html)
// ==============================================
function initProfile() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    authFirebase.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        try {
            // Cargar datos del usuario
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('prof-dni').value = userData.dni;
                document.getElementById('prof-apellidos').value = userData.apellidos || '';
                document.getElementById('prof-nombres').value = userData.nombres;
                document.getElementById('prof-email').value = userData.email;
                document.getElementById('prof-telefono').value = userData.telefono;

                const userRole = userData.rol || 'alumno';
                
                // Adaptar UI según rol
                if (userRole === 'instructor') {
                    document.getElementById('portal-role-title').textContent = 'Docente';
                    document.querySelectorAll('.alumno-only').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.instructor-only').forEach(el => el.style.display = 'block');
                    document.getElementById('main-courses-title').textContent = 'Mis Aulas Asignadas';
                    // Renderizar aulas asignadas al docente
                    renderInstructorCourses(user.uid);
                } else {
                    document.getElementById('portal-role-title').textContent = 'del Alumno';
                    document.querySelectorAll('.alumno-only').forEach(el => el.style.display = 'block');
                    document.querySelectorAll('.instructor-only').forEach(el => el.style.display = 'none');
                    document.getElementById('main-courses-title').textContent = 'Mis Cursos y Aulas';
                    // Renderizar cursos inscriptos del alumno
                    renderEnrolledCourses(userData.cursos || []);
                }
            }
        } catch (error) {
            console.error("Error cargando perfil:", error);
        }
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = authFirebase.currentUser;
        if (!user) return;

        try {
            await db.collection('users').doc(user.uid).update({
                apellidos: document.getElementById('prof-apellidos').value,
                nombres: document.getElementById('prof-nombres').value,
                email: document.getElementById('prof-email').value,
                telefono: document.getElementById('prof-telefono').value
            });
            alert('Datos actualizados exitosamente.');
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            alert('Hubo un error al actualizar los datos.');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authFirebase.signOut().then(() => {
                window.location.href = 'index.html';
            });
        });
    }
}

async function renderEnrolledCourses(enrolledIds) {
    const container = document.getElementById('my-courses-container');
    const noCourses = document.getElementById('no-courses-msg');
    
    if (!container || !noCourses) return;
    
    if (!enrolledIds || enrolledIds.length === 0) {
        noCourses.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    noCourses.style.display = 'none';
    container.innerHTML = '';
    
    const today = new Date();

    for (const cId of enrolledIds) {
        try {
            const doc = await window.db.collection('cursos').doc(cId).get();
            if (doc.exists) {
                const data = doc.data();
                
                // Verificar expiración (si hay fecha_fin y ya pasó)
                if (data.fecha_fin) {
                    const endDate = new Date(data.fecha_fin);
                    if (endDate < today) {
                        continue; // Curso vencido, no lo renderiza en el dashboard activo
                    }
                }

                const el = document.createElement('div');
                el.className = 'card course-card';
                el.style.display = 'flex';
                el.style.flexDirection = 'column';
                el.innerHTML = `
                    <div class="card-content" style="flex: 1;">
                        <span class="badge mb-2 bg-success">Inscripto / Activo</span>
                        <h3>${data.title}</h3>
                        <p class="text-sm text-gray mt-2">📍 ${data.sede}</p>
                        <p class="text-sm text-gray">🚀 Inicio: ${data.fecha_inicio || 'A definir'}</p>
                    </div>
                    <div style="padding: 1rem; border-top: 1px solid var(--color-border); display: flex; gap: 0.5rem;">
                        <a href="#" class="btn btn-primary btn-sm touch-target" style="flex: 1; text-align: center;">Ir al Aula</a>
                        <button class="btn btn-outline btn-sm touch-target" style="color: var(--color-danger); border-color: var(--color-danger);" onclick="dropCourse('${cId}')">Baja</button>
                    </div>
                `;
                container.appendChild(el);
            }
        } catch (error) {
            console.error("Error cargando curso inscripto", error);
        }
    }
    
    // Si todos estaban vencidos y no se renderizó nada
    if (container.children.length === 0) {
        noCourses.style.display = 'block';
    }
}

async function renderInstructorCourses(instructorUid) {
    const container = document.getElementById('my-courses-container');
    const noCourses = document.getElementById('no-courses-msg');
    
    if (!container || !noCourses) return;

    try {
        const snapshot = await window.db.collection('cursos').where('instructor_id', '==', instructorUid).get();
        
        if (snapshot.empty) {
            noCourses.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        noCourses.style.display = 'none';
        container.innerHTML = '';

        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'card course-card';
            el.style.display = 'flex';
            el.style.flexDirection = 'column';
            el.innerHTML = `
                <div class="card-content" style="flex: 1;">
                    <span class="badge mb-2 bg-primary">Docente a cargo</span>
                    <h3>${data.title}</h3>
                    <p class="text-sm text-gray mt-2">📍 ${data.sede}</p>
                    <p class="text-sm text-gray">🚀 Inicio: ${data.fecha_inicio || 'A definir'}</p>
                </div>
                <div style="padding: 1rem; border-top: 1px solid var(--color-border);">
                    <a href="#" class="btn btn-primary btn-sm btn-block touch-target" style="text-align: center;">Ingresar al Aula (Admin)</a>
                </div>
            `;
            container.appendChild(el);
        });
    } catch (error) {
        console.error("Error cargando cursos del instructor", error);
    }
}

// Función global para dar de baja
window.dropCourse = async function(courseId) {
    if(confirm('¿Estás SEGURO de cancelar tu inscripción? Perderás tu vacante.')) {
        const user = window.authFirebase.currentUser;
        if(user) {
            try {
                const userRef = window.db.collection('users').doc(user.uid);
                await userRef.update({
                    cursos: firebase.firestore.FieldValue.arrayRemove(courseId)
                });
                alert('Se ha cancelado tu inscripción exitosamente.');
                window.location.reload();
            } catch (e) {
                console.error(e);
                alert('Error al procesar la baja.');
            }
        }
    }
};


// ==============================================
// 6. Estado Global y Navbar UI (index.html)
// ==============================================
function initGlobalAuth() {
    const navBtnContainer = document.getElementById('auth-nav-btn');
    if (!navBtnContainer) return;

    authFirebase.onAuthStateChanged((user) => {
        if (user) {
            navBtnContainer.innerHTML = `<a href="profile.html" class="btn btn-outline touch-target">Mi Perfil</a>`;
        } else {
            navBtnContainer.innerHTML = `<a href="login.html" class="btn btn-gradient touch-target">Iniciar Sesión</a>`;
        }
    });
}

// Inicializadores
document.addEventListener('DOMContentLoaded', () => {
    initGlobalAuth();
    initStepper();
    initRegister();
    initLogin();
    initProfile();
});
