document.getElementById("resetForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!token) {
    alert("Token no encontrado. Usa el enlace correcto desde tu correo.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Contraseña restablecida con éxito. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Error al restablecer la contraseña");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo conectar con el servidor");
  }
});


