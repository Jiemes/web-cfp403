/**
 * Archivo principal JS - web-cfp403
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Lógica de Formulario de Pre-inscripción (register.html) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        
        // Manejo del Drag & Drop para el archivo
        const fileInput = document.getElementById('dniArchivo');
        const fileDropArea = document.getElementById('fileDropArea');
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('dragover'), false);
        });

        fileDropArea.addEventListener('drop', (e) => {
            let dt = e.dataTransfer;
            let files = dt.files;
            fileInput.files = files; // Asignar archivos al input
            updateFileName();
        });

        fileInput.addEventListener('change', updateFileName);

        function updateFileName() {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
                fileNameDisplay.classList.remove('text-danger');
                fileNameDisplay.classList.add('text-success'); // color no definido pero es visual
            } else {
                fileNameDisplay.textContent = 'Ningún archivo seleccionado.';
            }
        }

        // Validación y Submit MOCK
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Basic Frontend Validation
            let isValid = true;
            const dni = document.getElementById('dni').value;
            
            // Reset errors
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            
            if (dni.length < 7) {
                document.getElementById('dniError').textContent = "DNI inválido.";
                isValid = false;
            }

            if (!fileInput.files.length) {
                document.getElementById('archivoError').textContent = "Debes adjuntar el archivo de tu DNI.";
                isValid = false;
            }

            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const btnText = submitBtn.querySelector('.btn-text');
                
                // UX Feedback
                submitBtn.disabled = true;
                btnText.textContent = "Procesando...";
                
                // MOCK FETCH API (Simulando guardado en Supabase/Backend)
                try {
                    // await fetch('https://api.supabase.co/...', { method: 'POST', body: new FormData(registerForm) });
                    await new Promise(r => setTimeout(r, 1500)); // Simulando delay
                    
                    // Comprobar duplicados simulado (DNI 12345678 da error)
                    if (dni === '12345678') {
                        throw new Error("El DNI ingresado ya se encuentra registrado.");
                    }

                    // Éxito
                    document.getElementById('formSuccess').classList.remove('hidden');
                    registerForm.reset();
                    updateFileName();
                    
                } catch (error) {
                    document.getElementById('dniError').textContent = error.message;
                } finally {
                    submitBtn.disabled = false;
                    btnText.textContent = "Confirmar Pre-inscripción";
                }
            }
        });

        // Pre-seleccionar curso basado en la URL (?curso=web)
        const urlParams = new URLSearchParams(window.location.search);
        const cursoParam = urlParams.get('curso');
        if (cursoParam) {
            const select = document.getElementById('curso');
            if (select) select.value = cursoParam;
        }
    }

    // --- Filtros Portfolio (portfolio.html) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Pequeña animación
                        item.style.opacity = '0';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

});
