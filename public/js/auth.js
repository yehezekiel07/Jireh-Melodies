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

function openForgotModal() {
  document.getElementById("forgotModal").style.display = "flex";
}

function closeForgotModal() {
  document.getElementById("forgotModal").style.display = "none";
}

async function sendResetLink() {
  const email = document.getElementById("forgotEmail").value;
  const msg = document.getElementById("forgotMessage");

  if (!email) {
    msg.innerText = "Please enter email";
    return;
  }

  try {
    const res = await fetch("/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    msg.innerText = data.message;

    if (data.success) {
      msg.style.color = "lightgreen";
    } else {
      msg.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    msg.innerText = "Something went wrong";
  }
}
