// Elements
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");
const todoApp = document.getElementById("todoApp");
const todoForm = document.getElementById("TodoForm");
const todoTbody = document.getElementById("todoTbody");
const usernameDisplay = document.getElementById("usernameDisplay");

// Check authentication
async function checkAuth() {
  try {
    const res = await fetch("/me", { credentials: "include" });
    if (res.status === 401) {
      loginLink.style.display = "inline-block";
      logoutBtn.style.display = "none";
      todoApp.style.display = "none";
      return;
    }

    const data = await res.json();
    if (data.loggedIn) {
      loginLink.style.display = "none";
      logoutBtn.style.display = "inline-block";
      todoApp.style.display = "block";
      if (usernameDisplay) usernameDisplay.textContent = data.username;
      fetchTodosAndRender();
    } else {
      loginLink.style.display = "inline-block";
      logoutBtn.style.display = "none";
      todoApp.style.display = "none";
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
}

// Logout
logoutBtn.addEventListener("click", async () => {
  await fetch("/auth/logout", { credentials: "include" });
  loginLink.style.display = "inline-block";
  logoutBtn.style.display = "none";
  todoApp.style.display = "none";
});

// Fetch todos
async function fetchTodosAndRender() {
  const res = await fetch("/todos", { credentials: "include" });
  if (res.status === 401) return checkAuth();
  const data = await res.json();
  renderTable(data.todos || []);
}

// Render table
function renderTable(todos) {
  todoTbody.innerHTML = "";
  todos.forEach((t) => {
    const tr = document.createElement("tr");
    tr.dataset.id = t._id;

    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.deadline.split("T")[0]}</td>
      <td>${t.importance}</td>
      <td>${t.daysLeft ?? "—"}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </td>
    `;
    todoTbody.appendChild(tr);
  });
}

// Enter edit mode
function enterEditMode(tr) {
  const id = tr.dataset.id;
  const cells = tr.querySelectorAll("td");
  const [name, deadline, importance] = [cells[0].textContent, cells[1].textContent, cells[2].textContent];

  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm name-input" value="${name}"></td>
    <td><input type="date" class="form-control form-control-sm deadline-input" value="${deadline}"></td>
    <td>
      <select class="form-select form-select-sm importance-select">
        <option value="low" ${importance === "low" ? "selected" : ""}>Low</option>
        <option value="medium" ${importance === "medium" ? "selected" : ""}>Medium</option>
        <option value="high" ${importance === "high" ? "selected" : ""}>High</option>
      </select>
    </td>
    <td>—</td>
    <td>
      <button class="btn btn-sm btn-success save-btn">Save</button>
      <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
    </td>
  `;
  tr.dataset.id = id;
}

// Update todo
async function updateTodo(id, name, deadline, importance) {
  const res = await fetch("/todos/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, name, deadline, importance })
  });
  const data = await res.json();
  renderTable(data.todos || []);
}

// Delete todo
async function deleteTodo(id) {
  const res = await fetch("/todos/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  renderTable(data.todos || []);
}

// Submit form
async function submit(event) {
  event.preventDefault();
  const name = document.getElementById("todoName").value.trim();
  const deadline = document.getElementById("todoDeadline").value;
  const importance = document.querySelector('input[name="importance"]:checked').value;

  const res = await fetch("/todos/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, deadline, importance })
  });
  const data = await res.json();
  renderTable(data.todos || []);
  todoForm.reset();
  document.querySelector('input[name="importance"][value="low"]').checked = true;
}

// Handle table button clicks
todoTbody.addEventListener("click", async (e) => {
  const btn = e.target;
  const tr = btn.closest("tr");
  if (!tr) return;

  const id = tr.dataset.id;

  if (btn.classList.contains("edit-btn")) enterEditMode(tr);
  if (btn.classList.contains("cancel-btn")) fetchTodosAndRender();
  if (btn.classList.contains("save-btn")) {
    const nameInput = tr.querySelector(".name-input");
    const deadlineInput = tr.querySelector(".deadline-input");
    const importanceSelect = tr.querySelector(".importance-select");
    await updateTodo(id, nameInput.value.trim(), deadlineInput.value, importanceSelect.value);
  }
  if (btn.classList.contains("delete-btn")) await deleteTodo(id);
});

todoForm.addEventListener("submit", submit);
window.onload = checkAuth;


