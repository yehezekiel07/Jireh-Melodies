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
      if (data.role === "admin") {
        window.location.href = "/admin-dashboard.html";
      } else {
        window.location.href = "/user-dashboard.html";
      }
    } else {
      alert("Invalid login credentials");
    }
  });
}
