// Al cargar la página, rellenamos automáticamente el campo con el identifier guardado
document.addEventListener("DOMContentLoaded", () => {
  const identifierField = document.getElementById("emailOrMatricula");
  const savedIdentifier = localStorage.getItem("recoverIdentifier");

  if (savedIdentifier) {
    identifierField.value = savedIdentifier;
    identifierField.readOnly = true; // para que no se pueda modificar
  }
});

// Manejo del formulario de reseteo de contraseña
document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Siempre usamos el valor guardado en localStorage
  const identifier = localStorage.getItem("recoverIdentifier");
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!identifier) {
    alert("No se encontró el correo o matrícula. Regresa al inicio e intenta de nuevo.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        password: newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      alert("✅ Cambio de contraseña exitoso.");
      localStorage.removeItem("recoverIdentifier"); // limpiamos después de usarlo
      setTimeout(() => {
        window.location.href = "index.html"; // redirigir a login
      }, 1000);
    } else {
      alert(data.message || "❌ Error al restablecer la contraseña.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo conectar con el servidor.");
  }
});




