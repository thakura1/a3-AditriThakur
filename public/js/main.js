// Elements
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");
const todoApp = document.getElementById("todoApp");
const todoForm = document.getElementById("TodoForm");
const todoTbody = document.querySelector("#todoTbody");
const usernameDisplay = document.getElementById("usernameDisplay");

// Check user authentication
async function checkAuth() {
  try {
    // Request user info, include cookies
    const res = await fetch("/me", { credentials: "include" });
    // If unauthorized, only show login
    if (res.status === 401) {
      loginLink.style.display = "inline-block";
      logoutBtn.style.display = "none";
      todoApp.style.display = "none";
      return;
    }

    const data = await res.json();
    // Hide login
    if (data.loggedIn) {
      loginLink.style.display = "none";
      logoutBtn.style.display = "inline-block";
      todoApp.style.display = "block";
      // Display Username
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
  // request log out, send cookies, hide everything except loggin
  await fetch("/auth/logout", { credentials: "include" });
  loginLink.style.display = "inline-block";
  logoutBtn.style.display = "none";
  todoApp.style.display = "none";
});

// CRUD functions
async function fetchTodosAndRender() {
  const res = await fetch("/todos", { credentials: "include" });
  if (res.status === 401) return checkAuth(); // Not authenticated
  const data = await res.json();
  renderTable(data.todos || []);
}

function renderTable(todos) {
  todoTbody.innerHTML = ""; // Clear
  todos.forEach((t) => {
    const tr = document.createElement("tr"); // Row
    tr.dataset.id = t._id || t.id;
    tr.dataset.name = t.name;
    tr.dataset.deadline = t.deadline;
    tr.dataset.importance = t.importance;

    const tdName = document.createElement("td"); tdName.textContent = t.name;
    const tdDeadline = document.createElement("td"); tdDeadline.textContent = t.deadline;
    const tdImportance = document.createElement("td"); tdImportance.textContent = t.importance;
    const tdDays = document.createElement("td"); tdDays.textContent = t.daysLeft;
    tdDays.textContent = t.daysLeft !== undefined ? t.daysLeft : "—"; // -- if no daysLeft
    const tdActions = document.createElement("td");
    tdActions.innerHTML = `<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>`;

    tr.append(tdName, tdDeadline, tdImportance, tdDays, tdActions);
    todoTbody.appendChild(tr);
  });
}

// Edit Mode -> turn text into interactive format
function enterEditMode(tr) {
  // Extract data
  const { id, name, deadline, importance } = tr.dataset;
  tr.innerHTML = "";

  // text input for name
  const tdName = document.createElement("td");
  const nameInput = document.createElement("input"); 
  nameInput.type = "text"; 
  nameInput.value = name; 
  tdName.appendChild(nameInput);

  // date input for deadline
  const tdDeadline = document.createElement("td");
  const dateInput = document.createElement("input"); 
  dateInput.type = "date"; 
  dateInput.value = deadline; 
  tdDeadline.appendChild(dateInput);

  // dropdown for importance
  const tdImportance = document.createElement("td");
  const select = document.createElement("select");
  ["low", "medium", "high"].forEach(lvl => {
    const opt = document.createElement("option"); 
    opt.value = lvl; 
    opt.textContent = lvl;
    if (lvl === importance) opt.selected = true;
    select.appendChild(opt);
  });
  tdImportance.appendChild(select);

  // daysLeft is not editable, placeholder
  const tdDays = document.createElement("td"); tdDays.textContent = "—";
  // Buttons for saving and canceling 
  const tdActions = document.createElement("td");
  tdActions.innerHTML = `<button class="save-btn">Save</button> <button class="cancel-btn">Cancel</button>`;

  tr.append(tdName, tdDeadline, tdImportance, tdDays, tdActions);
  tr.dataset.id = id;
}

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

async function submit(event) {
  event.preventDefault();

  // Get Data
  const name = document.querySelector("#todoName").value.trim();
  const deadline = document.querySelector("#todoDeadline").value;
  const importance = document.querySelector('input[name="importance"]:checked').value;

  // Send to server
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

// Button Modes
todoTbody.addEventListener("click", async (e) => {
  const btn = e.target;
  const tr = btn.closest("tr");
  if (!tr) return;

  if (btn.classList.contains("delete-btn")) await deleteTodo(tr.dataset.id);
  if (btn.classList.contains("edit-btn")) enterEditMode(tr);
  if (btn.classList.contains("cancel-btn")) fetchTodosAndRender();
  if (btn.classList.contains("save-btn")) {
    const [nameInput, dateInput, select] = tr.querySelectorAll("input, select");
    await updateTodo(tr.dataset.id, nameInput.value.trim(), dateInput.value, select.value);
  }
});

// Event listener
document.getElementById("TodoForm").addEventListener("submit", submit);

window.onload = checkAuth;

