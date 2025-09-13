// FRONT-END (CLIENT) JAVASCRIPT HERE

// Get todos and make table
async function fetchTodosAndRender() {
  const res = await fetch("/todos");
  const data = await res.json();
  renderTable(data.todos || []);
}

// Create the table rows based on the array of data
function renderTable(todos) {
  // Based on id "todoTbody"
  const tbody = document.querySelector("#todoTbody");
  tbody.innerHTML = ""; // So Redraws

  // For each todo create a row with 3 columns
  todos.forEach(t => {

    const tr = document.createElement("tr");

    // For editing mode -> show og values
    tr.dataset.id = t.id;
    tr.dataset.name = t.name;
    tr.dataset.deadline = t.deadline;
    tr.dataset.importance = t.importance;

    // Visulaize thg
    const tdName = document.createElement("td");
    tdName.textContent = t.name;

    const tdDeadline = document.createElement("td");
    tdDeadline.textContent = t.deadline;

    const tdImportance = document.createElement("td");
    tdImportance.textContent = t.importance;

    const tdDays = document.createElement("td");
    tdDays.textContent = t.daysLeft;

    // Update and Delete buttons are in each row
    const tdActions = document.createElement("td");
    tdActions.innerHTML = `
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>`;

    tr.append(tdName, tdDeadline, tdImportance, tdDays, tdActions);
    tbody.appendChild(tr);
  });
}

// Turn a row into edit mode
function enterEditMode(tr) {
  const id = tr.dataset.id;
  const name = tr.dataset.name;
  const deadline = tr.dataset.deadline;
  const importance = tr.dataset.importance;

  tr.innerHTML = ""; // clear row

  // Name becomes text input feild
  const tdName = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = name;
  nameInput.required = true;
  tdName.appendChild(nameInput);

  // Deadline becomes date input feild
  const tdDeadline = document.createElement("td");
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.value = deadline;
  dateInput.required = true;
  tdDeadline.appendChild(dateInput);

  // Importance becomes a radio feild
  const tdImportance = document.createElement("td");
  const select = document.createElement("select");
  ["low", "medium", "high"].forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    // Select og importance
    if (level === importance) opt.selected = true;
    select.appendChild(opt);
  });
  tdImportance.appendChild(select);

  // Days left --> not editable, done on server
  const tdDays = document.createElement("td");
  tdDays.textContent = "—"; // Placeholder

  // Actions: Save or Cancel and Edit/Update
  const tdActions = document.createElement("td");
  tdActions.innerHTML = `
    <button class="save-btn">Save</button>
    <button class="cancel-btn">Cancel</button>
  `;

  tr.append(tdName, tdDeadline, tdImportance, tdDays, tdActions);
  tr.dataset.id = id; // keep id on row
}

async function updateTodo(id, name, deadline, importance) {
  const body = JSON.stringify({ id, name, deadline, importance });
  const res = await fetch("/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
  const data = await res.json();
  renderTable(data.todos || []);
}

async function deleteTodo(id) {
  const body = JSON.stringify({ id });
  const res = await fetch("/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
  const data = await res.json();
  renderTable(data.todos || []);
}

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault() 
  
  const name = document.querySelector("#todoName").value.trim();
  const deadline = document.querySelector("#todoDeadline").value;
  const importance = document.querySelector('input[name="importance"]:checked').value;
  
  const body = JSON.stringify({ name, deadline, importance });

  const response = await fetch( "/submit", {
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body 
  })

  const data = await response.json()
  console.log( "data:", data )
  renderTable(data.todos || []);

  // Reset Form
  document.querySelector("#TodoForm").reset();
  document.querySelector('input[name="importance"][value="low"]').checked = true;
}

window.onload = function() {
  // Only submit triggers 
  document.querySelector("#TodoForm").addEventListener("submit", submit);

   // Event handling for buttons in table
   const tbody = document.querySelector("#todoTbody");

   tbody.addEventListener("click", async (e) => {
     const btn = e.target;
     const tr = btn.closest("tr"); //bc button is in the row itself
     if (!tr) return;
 
     if (btn.classList.contains("delete-btn")) {
       const id = tr.dataset.id;
       await deleteTodo(id);
       return;
     }
 
     if (btn.classList.contains("edit-btn")) {
       enterEditMode(tr);
       return;
     }
 
     if (btn.classList.contains("cancel-btn")) {
       // Re-render all to restore original state
       fetchTodosAndRender();
       return;
     }
 
     if (btn.classList.contains("save-btn")) {
       const id = tr.dataset.id;
       const [nameInput, dateInput, select] = tr.querySelectorAll("input, select");
       const name = nameInput.value.trim();
       const deadline = dateInput.value;
       const importance = select.value;
 
       if (!name || !deadline || !importance) {
         alert("Please fill out all fields.");
         return;
       }
       await updateTodo(id, name, deadline, importance);
     }
   });

  fetchTodosAndRender();
}