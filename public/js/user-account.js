document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "/login";
    return;
  }

  const res = await fetch(`/user/${userId}`);
  const user = await res.json();

  // Fill fields
  document.getElementById("fullname").value = user.fullname || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("username").value = user.username || "";
  document.getElementById("password").value = "********";

  // 🔥 ROLE BASED UI (optional future use)
  if (user.role === "admin") {
    console.log("Admin logged in");
  } else {
    console.log("User logged in");
  }
});

// Logout (common for both)
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  });
}
