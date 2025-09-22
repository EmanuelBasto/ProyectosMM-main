const API_BASE = 'http://localhost:4000'; // backend principal

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const extraRegisterForm = document.getElementById('form-registro'); // nuevo formulario
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const loginLink = document.querySelector('.login-link a');
    const forgotLink = document.getElementById('forgotLink');
    const forgotModal = document.getElementById('forgotModal');
    const closeModal = document.getElementById('closeModal');

    
    forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.classList.remove("hidden");
    forgotModal.style.display = "flex"; // o "block", según tu diseño
    });

    closeModal.addEventListener('click', () => {
    forgotModal.classList.add("hidden");
    forgotModal.style.display = "none";
    });

    forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) {
        forgotModal.classList.add('hidden');
    }
    });




    // ===== Alternar login/registro SOLO si usas registerBox en la misma página =====
    if (loginLink) {
        loginLink.addEventListener('click', e => {
            e.preventDefault();
            if (registerBox && loginBox) {
                registerBox.classList.add('hidden');
                loginBox.classList.remove('hidden');
            }
        });
    }

    // ===== Login =====
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('userEmail', email);
                    alert('Login exitoso');
                    // 🔥 Redirige a la página de bienvenida
                    window.location.href = 'bienvenida.html';
                } else {
                    alert(data.message || 'Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al intentar iniciar sesión');
            }
        });
    }

    // ===== Registro avanzado (con rol y estado) =====
    if (extraRegisterForm) {
        extraRegisterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const datos = {
                nombre_completo: e.target.nombre_completo.value,
                matricula: e.target.matricula.value,
                email: e.target.email.value,
                password: e.target.password.value,
                rol: e.target.rol.value,
                estado: e.target.estado.value
            };

            fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert('Usuario registrado correctamente');
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Error al registrar usuario');
                });
        });
    }

   // ===== Recuperación de contraseña (versión robusta con logging y múltiples criterios) =====
sendRecover.addEventListener('click', async (ev) => {
    // Evitar comportamiento por defecto si el botón está dentro de un form
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();

    const id = recoverIdentifier.value.trim();
    if (!id) {
        recoverMessage.style.color = 'red';
        recoverMessage.textContent = 'Ingresa tu correo o matrícula.';
        return;
    }

    // Mensaje de estado
    recoverMessage.style.color = 'black';
    recoverMessage.textContent = 'Enviando...';

    try {
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: id })
        });

        // leer texto/crudo por si no es JSON válido
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

        console.log('Respuesta /status:', res.status, 'body:', data);

        // Criterios de éxito (intenta cubrir varias respuestas comunes)
        const mensaje = (data && (data.message || data.msg || data.msg_es)) || (data && data.raw) || '';
        const successFlag = data && (data.success === true || data.ok === true);
        const foundFlag = (mensaje && mensaje.toString().toLowerCase().includes('usuario')) ||
                          (mensaje && mensaje.toString().toLowerCase().includes('encontrado')) ||
                          (mensaje && mensaje.toString().toLowerCase().includes('found')) ||
                          successFlag ||
                          res.status === 200;

        if (res.ok || foundFlag) {
            // Mostrar mensaje del backend si lo hay
            recoverMessage.style.color = 'green';
            recoverMessage.textContent = mensaje || 'Revisa tu correo para un enlace de restablecimiento.';

            // Redirigir (usa ruta absoluta si tu html está en otra carpeta)
            // Cambia '/reset-password.html' a 'reset-password.html' según tu estructura.
            setTimeout(() => {
                window.location.href = 'reset-password.html';
            }, 1200);
            return;
        }

        // Si llegamos aquí: error
        recoverMessage.style.color = 'red';
        // intenta mostrar distintos campos de error
        const errMsg = (data && (data.error || data.message || data.msg)) || `Error del servidor (status ${res.status})`;
        recoverMessage.textContent = errMsg;
    } catch (err) {
        console.error('Fetch error forgot-password:', err);
        recoverMessage.style.color = 'red';
        recoverMessage.textContent = 'Error de conexión con el servidor.';
    }
});

        
});



