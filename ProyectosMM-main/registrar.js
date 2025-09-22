// registrar.js (versión simple: NO genera matrícula en el cliente; deja que el backend la genere)
const API_BASE = 'http://localhost:4000'; // ajusta si tu backend está en otra URL/puerto

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  const msgDiv = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const nombre_completo = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const rolSeleccionado = document.getElementById('rolSelect').value; // 'alumno' o 'tutor'

    // Validaciones básicas cliente
    if (!nombre_completo || !email || !password || !confirmPassword || !rolSeleccionado) {
      return showMsg('Por favor completa todos los campos.', true);
    }
    if (password !== confirmPassword) {
      return showMsg('Las contraseñas no coinciden.', true);
    }
    if (password.length < 6) {
      return showMsg('La contraseña debe tener al menos 6 caracteres.', true);
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';

    try {
      // Construimos payload SIN matricula; el backend debe generarla
      const payload = {
        nombre_completo,
        email,
        password,
        rol: rolSeleccionado,
        estado: "activo"
      };

      console.log('[Frontend] Enviando payload de registro:', payload);

      const resp = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await safeJson(resp);
      console.log('[Frontend] Respuesta registro:', resp.status, data);

      if (!resp.ok) {
        // Si el backend devuelve campos faltantes, mostrarlos
        if (data && data.missing) {
          return showMsg('Datos incompletos. Faltan: ' + data.missing.join(', '), true);
        }
        // Mensajes más informativos si vienen del backend
        const serverMsg = data?.message || `Error ${resp.status}`;
        return showMsg('Error: ' + serverMsg, true);
      }

      // Éxito: backend retorna user con matrícula generada
      const user = data?.user;
      const matricula = user?.matricula || '---';
      showMsg(`✅ Usuario creado correctamente. Matrícula: ${matricula}`, false);

      // Redirigir al index después de 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);

      form.reset();
    } catch (err) {
      console.error('[Frontend] Error en registro:', err);
      showMsg('Error inesperado. Revisa la consola y el servidor.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Registrarse';
    }
  });

  // Helpers
  function showMsg(text, isError = false) {
    msgDiv.textContent = text;
    msgDiv.style.color = isError ? 'crimson' : 'green';
  }
  function clearMsg() {
    msgDiv.textContent = '';
  }
  async function safeJson(response) {
    try { return await response.json(); } catch { return null; }
  }
});




