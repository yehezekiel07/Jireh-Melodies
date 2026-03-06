"use strict";

const mainNavList = document.querySelectorAll(".main-nav-list-item");
mainNavList.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < mainNavList.length; i++) {
      mainNavList[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

const faqQuestionBox = document.querySelectorAll(".faq-question-box");
faqQuestionBox.forEach((item) => {
  item.addEventListener("click", () => {
    for (let i = 0; i < faqQuestionBox.length; i++) {
      faqQuestionBox[i].classList.remove("active");
    }
    item.classList.add("active");
  });
});

// Login Functionality

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

// Generate User Credentials Functionality

const generateBtn = document.getElementById("generateBtn");

if (generateBtn) {
  let generated = false;

  generateBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    if (!generated) {
      const fullname = document.getElementById("fullname").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      if (fullname === "") {
        alert("Please enter Full Name before generating credentials");
        return;
      }

      if (phone === "") {
        alert("Please enter Phone Number before generating credentials");
        return;
      }

      if (email === "") {
        alert("Please enter Email Address before generating credentials");
        return;
      }

      const response = await fetch("/generate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email }),
      });

      const data = await response.json();

      document.getElementById("username").value = data.username;
      document.getElementById("password").value = data.password;

      document.getElementById("credentialsSection").style.display = "flex";

      generateBtn.textContent = "Save";

      generated = true;
    } else {
      const fullname = document.getElementById("fullname").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const response = await fetch("/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email, username, password }),
      });

      const data = await response.json();

      // Save Functionality

      if (data.success) {
        alert("User created successfully");

        window.location.href = "/admin-dashboard.html";
      } else {
        alert("Error saving user");
      }
    }
  });
}

// User Table Creation

const usersTable = document.getElementById("usersTable");

if (usersTable) {
  fetch("/users")
    .then((res) => res.json())
    .then((data) => {
      usersTable.innerHTML = "";

      data.forEach((user) => {
        const row = `
                <tr>
                    <td>${user.fullname}</td>
                    <td>${user.phone}</td>
                    <td>${user.email}</td>
                    <td>${user.username}</td>
                </tr>
            `;

        usersTable.innerHTML += row;
      });
    })
    .catch((error) => console.log(error));
}
