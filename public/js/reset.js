async function resetPassword() {
  const password = document.getElementById("password").value;

  const token = window.location.pathname.split("/").pop();

  console.log("Token:", token);
  console.log("Password:", password);

  try {
    const res = await fetch(`/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response data:", data);

    document.getElementById("message").innerText = data.message;
  } catch (err) {
    console.error("ERROR:", err);
  }
}
