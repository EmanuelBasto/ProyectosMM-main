document.addEventListener('DOMContentLoaded', () => {
  // Usa el API_BASE global si existe, si no usa localhost:4000
  const API_BASE = window.API_BASE || 'http://localhost:4000';

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const tokenField = document.getElementById('tokenField');
  const msg = document.getElementById('msg');

  if (!token) {
    msg.textContent = 'Token no proporcionado. Revisa el enlace del correo.';
    return;
  }

  if (tokenField) tokenField.value = token;

  document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirm = document.getElementById('confirmPassword').value.trim();
    if (newPassword !== confirm) {
      msg.textContent = 'Contraseñas no coinciden';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword })
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        msg.textContent = data?.message || `Error ${res.status}`;
      } else {
        msg.style.color = 'green';
        msg.textContent = 'Contraseña actualizada correctamente.';

        // Opcional: redirigir al login después de 2s
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'Error de conexión';
    }
  });

// Al final del DOMContentLoaded de reset.js (y repite en registrar.js si quieres)
document.querySelectorAll('.toggle-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const input = document.getElementById(id);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.classList.toggle('revealed', isHidden);
    btn.setAttribute('aria-pressed', String(isHidden));
  });
});

});







