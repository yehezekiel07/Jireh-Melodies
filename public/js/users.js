// Generate User Credentials Functionality (New)

const generateBtn = document.getElementById("generateBtn");

if (generateBtn && window.location.pathname.includes("/add-user")) {
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
      let password = document.getElementById("password").value;

      if (password === "********") {
        password = "";
      }

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

        window.location.href = "/admin-dashboard";
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
           <td class="action-links">
            <a class="action-link" href="/view-user?id=${user._id}">
              <i class="ph ph-eye link-icon"></i>
            </a>

            <a class="action-link" href="/edit-user?id=${user._id}">
             <i class="ph ph-pencil-simple link-icon"></i>
            </a>
           </td>
         </tr>
`;

        usersTable.innerHTML += row;
      });
    })
    .catch((error) => console.log(error));
}

// User Details (Pre-filled) for Updating User

if (window.location.pathname.includes("/edit-user")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`/user/${id}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("phone").value = user.phone;
      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("password").value = "********";
    });
}

// Generate Cred For Updating User

if (generateBtn && window.location.pathname.includes("/edit-user")) {
  let generated = false;

  generateBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!generated) {
      const response = await fetch("/generate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, phone, email }),
      });

      const data = await response.json();

      document.getElementById("username").value = data.username;
      document.getElementById("password").value = "********";

      generateBtn.textContent = "Update";

      generated = true;
    } else {
      const username = document.getElementById("username").value;
      let password = document.getElementById("password").value;

      if (password === "********") {
        password = "";
      }

      const response = await fetch(`/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          phone,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("User updated successfully");

        window.location.href = "/admin-dashboard";
      } else {
        alert("Error updating user");
      }
    }
  });
}
