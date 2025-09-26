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

    // --- Elementos relacionados con recuperación (asegúrate de tener estos IDs en tu HTML) ---
    const sendRecover = document.getElementById('sendRecover');           // botón/enlace que envía la solicitud
    const recoverIdentifier = document.getElementById('recoverIdentifier'); // input para email/matrícula
    const recoverMessage = document.getElementById('recoverMessage');     // contenedor para mensajes al usuario

    forgotLink && forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotModal.classList.remove("hidden");
        forgotModal.style.display = "flex"; // o "block", según tu diseño
    });

    closeModal && closeModal.addEventListener('click', () => {
        forgotModal.classList.add("hidden");
        forgotModal.style.display = "none";
    });

    forgotModal && forgotModal.addEventListener('click', (e) => {
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

                // 🔥 Detectar matrícula (puede venir de backend o del campo email)
                const matricula = data.usuario?.matricula || "";
                const rol = data.usuario?.rol || "";
 
                
                if (!matricula) {
                    alert("No se pudo determinar el tipo de usuario.");
                    return;
                }

                // 🔍 Validar prefijo
                if (rol.toLowerCase().includes("admin")) {
                    window.location.href = "Interfaces/admin/admin.html";
                } else if (rol.toLowerCase().includes("tutor")) {
                    window.location.href = "Interfaces/tutores/Tutores.html";
                } else if (rol.toLowerCase().includes("alum")) {
                    window.location.href = "Interfaces/alumnos/Alumnos.html";
                } else {
                    alert("Rol no reconocido");
                }

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

   // ===== Recuperación de contraseña (validando existencia en DB) =====
   if (sendRecover) {
       sendRecover.addEventListener('click', async (ev) => {
           if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();

           const id = (recoverIdentifier && recoverIdentifier.value) ? recoverIdentifier.value.trim() : '';
           if (!id) {
               if (recoverMessage) {
                   recoverMessage.style.color = 'red';
                   recoverMessage.textContent = 'Ingresa tu correo o matrícula.';
               }
               return;
           }

           // limpiamos cualquier recoverIdentifier previo (evita usar valores viejos)
           try { localStorage.removeItem('recoverIdentifier'); } catch(e) { /* ignore */ }

           // Mensaje de estado
           if (recoverMessage) {
               recoverMessage.style.color = 'black';
               recoverMessage.textContent = 'Verificando...';
           }

           // bloquear botón mientras se verifica
           const prevDisabled = sendRecover.disabled;
           try { sendRecover.disabled = true; } catch (e) { /* ignore */ }

           try {
               const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ identifier: id })
               });

               // intentar parsear JSON según content-type
               const ct = (res.headers.get('content-type') || '').toLowerCase();
               let data = {};
               if (ct.includes('application/json')) {
                   data = await res.json();
               } else {
                   const text = await res.text();
                   try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
               }

               console.log('forgot-password ->', res.status, data);

               // Caso explícito: BACKEND RESPONDE 404 -> Usuario no encontrado
               if (res.status === 404) {
                   if (recoverMessage) {
                       recoverMessage.style.color = 'red';
                       recoverMessage.textContent = 'Usuario no encontrado';
                   }
                   return;
               }

               // Si backend devuelve explícitamente { exists: false } o mensaje "no encontrado"/"no existe"
               const msg = (data && (data.message || data.msg || data.raw || '')).toString().toLowerCase();
               if ((data && data.exists === false) || msg.includes('no encontrado') || msg.includes('no existe') || msg.includes('not found')) {
                   if (recoverMessage) {
                       recoverMessage.style.color = 'red';
                       recoverMessage.textContent = 'Usuario no encontrado';
                   }
                   return;
               }

               // Caso éxito (200) — sólo aquí guardamos y redirigimos
               if (res.ok) {
                   try {
                       localStorage.setItem('recoverIdentifier', id);
                   } catch (storageErr) {
                       console.warn('No se pudo escribir en localStorage:', storageErr);
                   }
                   if (recoverMessage) {
                       recoverMessage.style.color = 'green';
                       recoverMessage.textContent = (data && (data.message || data.msg)) || 'Revisa tu correo para un enlace de restablecimiento.';
                   }
                   setTimeout(() => {
                       window.location.href = 'reset-password.html';
                   }, 900);
                   return;
               }

               // Otros errores
               if (recoverMessage) {
                   recoverMessage.style.color = 'red';
                   recoverMessage.textContent = (data && (data.error || data.message || data.msg)) || `Error del servidor (status ${res.status})`;
               }

           } catch (err) {
               console.error('Fetch error forgot-password:', err);
               if (recoverMessage) {
                   recoverMessage.style.color = 'red';
                   recoverMessage.textContent = 'Error de conexión con el servidor.';
               }
           } finally {
               // re-habilitar botón
               try { sendRecover.disabled = prevDisabled; } catch(e) { /* ignore */ }
           }
       });
   } else {
       console.warn('sendRecover no encontrado en el DOM. Asegúrate de tener un elemento con id="sendRecover".');
   }

});




