/**
 * auth-guard.js - Seguridad de Rutas Basada en Roles (RBAC)
 * Debe cargarse DESPUÉS de firebase-config.js y ANTES del body
 */

const authGuard = {
    async requireRole(requiredRole) {
        return new Promise((resolve) => {
            window.authFirebase.onAuthStateChanged(async (user) => {
                if (!user) {
                    // No está logueado
                    window.location.replace('index.html');
                    resolve(false);
                    return;
                }

                try {
                    const doc = await window.db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        const userData = doc.data();
                        const userRole = userData.rol || 'alumno'; // Default a alumno si no tiene rol
                        
                        if (userRole === requiredRole) {
                            // Permiso concedido
                            resolve(true);
                        } else {
                            // No tiene permisos
                            alert('Acceso Denegado: No tienes los permisos necesarios para ver esta página.');
                            window.location.replace('index.html');
                            resolve(false);
                        }
                    } else {
                        window.location.replace('index.html');
                        resolve(false);
                    }
                } catch (error) {
                    console.error("Error verificando permisos:", error);
                    window.location.replace('index.html');
                    resolve(false);
                }
            });
        });
    }
};

window.authGuard = authGuard;
