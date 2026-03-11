// Generate User Credentials Functionality (New)

const generateBtn = document.getElementById("generateBtn");

if (generateBtn && window.location.pathname.includes("add-user.html")) {
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
           <td class="action-links">
            <a class="action-link" href="/view-user.html?id=${user._id}">
              <i class="ph ph-eye link-icon"></i>
            </a>

            <a class="action-link" href="/edit-user.html?id=${user._id}">
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

// Load user Data

if (window.location.pathname.includes("view-user.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`/user/${id}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("phone").value = user.phone;
      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("password").value = user.password;
    });
}

// User Details (Pre-filled) for Updating User

if (window.location.pathname.includes("edit-user.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch(`/user/${id}`)
    .then((res) => res.json())
    .then((user) => {
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("phone").value = user.phone;
      document.getElementById("email").value = user.email;
      document.getElementById("username").value = user.username;
      document.getElementById("password").value = user.password;
    });
}

// Generate Cred For Updating User

if (generateBtn && window.location.pathname.includes("edit-user.html")) {
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
      document.getElementById("password").value = data.password;

      generateBtn.textContent = "Update";

      generated = true;
    } else {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

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

        window.location.href = "/admin-dashboard.html";
      } else {
        alert("Error updating user");
      }
    }
  });
}

// Delete User Functionality

const deleteBtn = document.getElementById("deleteUser");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    await fetch(`/delete-user/${id}`, {
      method: "DELETE",
    });

    alert("User deleted successfully");

    window.location.href = "/admin-dashboard.html";
  });
}
