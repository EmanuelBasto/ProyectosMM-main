const API_BASE = 'http://localhost:4000'; // backend principal

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    const registerLink = document.querySelector('.register-link a');
    const loginLink = document.querySelector('.login-link a');

    // ===== Alternar login/registro =====
    registerLink.addEventListener('click', e => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    });

    loginLink.addEventListener('click', e => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // ===== Login =====
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
                window.location.href = '/index.html';
            } else {
                alert(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar iniciar sesión');
        }
    });

    // ===== Registro =====
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!terms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: `${nombre} ${apellidos}`,
                    email,
                    password,
                    matricula: telefono
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro exitoso');
                loginBox.classList.remove('hidden');
                registerBox.classList.add('hidden');
            } else {
                alert(data.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar registrar');
        }
    });

    // ===== Recuperación de contraseña =====
    const forgotLink = document.getElementById('forgotLink');
    const modal = document.getElementById('forgotModal');
    const closeModal = document.getElementById('closeModal');
    const sendRecover = document.getElementById('sendRecover');
    const recoverMessage = document.getElementById('recoverMessage');
    const recoverIdentifier = document.getElementById('recoverIdentifier');

    if (forgotLink && modal) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            recoverMessage.textContent = '';
            recoverIdentifier.value = '';
            modal.classList.remove('hidden');
        });

        closeModal.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        sendRecover.addEventListener('click', async () => {
            const id = recoverIdentifier.value.trim();
            if (!id) {
                recoverMessage.style.color = 'red';
                recoverMessage.textContent = 'Ingresa tu correo o matrícula.';
                return;
            }

            recoverMessage.style.color = 'black';
            recoverMessage.textContent = 'Enviando...';

            try {
                const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier: id })
                });

                const data = await res.json();

                if (res.ok) {
                    recoverMessage.style.color = 'green';
                    recoverMessage.textContent = data.message || 'Revisa tu correo para un enlace de restablecimiento.';
                } else {
                    recoverMessage.style.color = 'red';
                    recoverMessage.textContent = data.message || 'No se pudo enviar el enlace.';
                }
            } catch (err) {
                recoverMessage.style.color = 'red';
                recoverMessage.textContent = 'Error de conexión con el servidor.';
                console.error(err);
            }
        });
    }
});

