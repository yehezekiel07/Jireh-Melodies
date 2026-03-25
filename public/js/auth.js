// Login Functionality

//Redirect admin / user

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("userId", data.userId);

      // 🔥 ADD THIS
      localStorage.setItem("userRole", data.role);

      if (data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (data.role === "superadmin") {
        window.location.href = "/user-dashboard"; // or special dashboard
      } else {
        window.location.href = "/user-dashboard";
      }
    } else {
      alert("Invalid login credentials");
    }
  });
}
