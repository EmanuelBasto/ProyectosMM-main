document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const identifier = document.getElementById("emailOrMatricula").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!identifier) {
    alert("Por favor ingresa tu correo o matrícula.");
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
    //Si funciona el cambio de contraseña
    if (response.ok && data.ok) {
      alert("✅ Cambio de contraseña exitoso.");
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




