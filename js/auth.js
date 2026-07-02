/**
 * auth.js - Módulo de Autenticación Simulada (LocalStorage)
 * Maneja el registro de usuarios, inicio de sesión y pre-inscripciones.
 */

// Helper para acceder a la base de datos simulada
const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('cfp_users') || '{}'),
    saveUsers: (users) => localStorage.setItem('cfp_users', JSON.stringify(users)),
    getCurrentUser: () => {
        const dni = localStorage.getItem('cfp_current_user');
        if (!dni) return null;
        return DB.getUsers()[dni] || null;
    },
    login: (dni) => localStorage.setItem('cfp_current_user', dni),
    logout: () => localStorage.removeItem('cfp_current_user'),
};

// ==============================================
// 1. Funciones de Sanitización y Formateo
// ==============================================
function capitalizeNames(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function sanitizeDNI(inputElement) {
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
            // Validación básica del Paso 1 antes de avanzar
            const requiredFields = ['email', 'nombres', 'dni', 'ciudad_res', 'direccion', 'telefono', 'estudios'];
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
    const nombresInput = document.getElementById('nombres');
    const form = document.getElementById('register-form');

    if (dniInput) sanitizeDNI(dniInput);
    
    if (nombresInput) {
        nombresInput.addEventListener('blur', (e) => {
            e.target.value = capitalizeNames(e.target.value);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dni = dniInput.value;
            const pass1 = document.getElementById('password').value;
            const pass2 = document.getElementById('password_confirm').value;

            if (pass1 !== pass2) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            const users = DB.getUsers();
            if (users[dni]) {
                alert('Ya existe una cuenta con ese DNI. Inicia sesión.');
                window.location.href = 'login.html';
                return;
            }

            // Guardar usuario
            users[dni] = {
                dni: dni,
                email: document.getElementById('email').value,
                nombres: nombresInput.value,
                password: pass1, // En producción real se hashea
                ciudad_res: document.getElementById('ciudad_res').value,
                direccion: document.getElementById('direccion').value,
                telefono: document.getElementById('telefono').value,
                nacionalidad: document.getElementById('nacionalidad').value,
                ciudad_nac: document.getElementById('ciudad_nac').value,
                estudios: document.getElementById('estudios').value,
                trabajo: document.getElementById('trabajo').value || 'NO',
                salud: document.getElementById('salud').value || 'NO',
                cursos: [] // Array de IDs de cursos
            };

            DB.saveUsers(users);
            
            // Auto login
            DB.login(dni);
            
            // Redirigir a profile o mantener en curso
            alert('¡Registro exitoso! Bienvenido al CFP 403.');
            
            // Si venía de querer anotarse a un curso
            const urlParams = new URLSearchParams(window.location.search);
            if(urlParams.get('curso')) {
                window.location.href = `index.html?enroll=${urlParams.get('curso')}`;
            } else {
                window.location.href = 'profile.html';
            }
        });
    }
}

// ==============================================
// 4. Flujo de Login y Recuperación (login.html)
// ==============================================
function initLogin() {
    const form = document.getElementById('login-form');
    const forgotBtn = document.getElementById('forgot-password-btn');
    const recoverModal = document.getElementById('recover-modal');
    
    if (form) {
        const dniInput = document.getElementById('login-dni');
        sanitizeDNI(dniInput);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const dni = dniInput.value;
            const pass = document.getElementById('login-password').value;
            
            const users = DB.getUsers();
            if (users[dni] && users[dni].password === pass) {
                DB.login(dni);
                window.location.href = 'profile.html';
            } else {
                alert('DNI o contraseña incorrectos.');
            }
        });
    }

    if (forgotBtn && recoverModal) {
        forgotBtn.addEventListener('click', (e) => {
            e.preventDefault();
            recoverModal.classList.add('active');
        });

        document.getElementById('close-recover')?.addEventListener('click', () => {
            recoverModal.classList.remove('active');
        });

        document.getElementById('recover-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Se ha enviado un enlace de recuperación a tu correo electrónico.');
            recoverModal.classList.remove('active');
        });
    }
}

// ==============================================
// 5. Estado Global y Navbar UI (Todas las vistas)
// ==============================================
function initGlobalAuth() {
    const currentUser = DB.getCurrentUser();
    const navBtnContainer = document.getElementById('auth-nav-btn');

    if (navBtnContainer) {
        if (currentUser) {
            navBtnContainer.innerHTML = `<a href="profile.html" class="btn btn-outline touch-target">Mi Perfil</a>`;
        } else {
            navBtnContainer.innerHTML = `<a href="login.html" class="btn btn-gradient touch-target">Iniciar Sesión</a>`;
        }
    }
}

// Inicializadores
document.addEventListener('DOMContentLoaded', () => {
    initGlobalAuth();
    initStepper();
    initRegister();
    initLogin();
});
