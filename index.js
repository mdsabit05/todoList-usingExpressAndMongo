const taskInput = document.getElementById("task");
const taskCategory = document.getElementById("category");
const date = document.getElementById("date");
const addBtn = document.getElementById("addbtn");
const tasklist = document.getElementById("tasklist");
const searchInput = document.getElementById("search");
const allBtn = document.getElementById("allbtn");
const pendingBtn = document.getElementById("pendingbtn");
const completedBtn = document.getElementById("completedbtn");
const categoryFilter = document.getElementById("categoryFilter");

let currentFLiter = "all";
let currentCategory = "all";

async function addTodo() {
  const task = {
    text: taskInput.value.trim(),
    category: taskCategory.value.trim().toLowerCase(),
    due_date: date.value ? new Date(date.value) : new Date(),
    created_at: new Date(),
    completed_at: null,
  };
  await fetch("https://todolist-usingexpressandmongo-3.onrender.com/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  await readonly();
  taskInput.value = "";
  taskCategory.value = "";
  date.value = "";
}

addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addTodo();
});

async function readonly() {
  const res = await fetch("https://todolist-usingexpressandmongo-3.onrender.com/api/todos");
  const task = await res.json();
  populateCategories(task);
  showTask(task);
}
readonly();

function showTask(task) {
  tasklist.innerHTML = "";

  task.forEach((task) => {
    // status filter
    if (currentFLiter === "pending" && task.completed_at !== null) return;
    if (currentFLiter === "completed" && task.completed_at === null) return;

    // Search filter
    const query = searchInput.value.trim().toLowerCase();
    const matchSearch =
      task.text.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query);

    if (!matchSearch) return;

    // category filter
    if (
      currentCategory !== "all" &&
      task.category.toLowerCase() !== currentCategory.toLowerCase()
    )
      return;

    const li = document.createElement("li");

    // dlt button
    const dltbtn = document.createElement("button");
    dltbtn.textContent = "✖";

    dltbtn.addEventListener("click", () => {
      deleteTask(task._id);
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed_at !== null;
    // checkbox click
      checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        task.completed_at = new Date();
      } else {
        task.completed_at = null;
      }
      updateTask(task._id , {
        completed_at : checkbox.checked ? new Date() : null
      });
    });

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;

    const categorySpan = document.createElement("span");
    categorySpan.textContent = task.category;

    const dueDateSpan = document.createElement("span");
    dueDateSpan.textContent = task.due_date
      ? new Date(task.due_date).toLocaleDateString("en-GB")
      : "";

    li.appendChild(checkbox);
    tasklist.appendChild(li);
    li.appendChild(textSpan);
    li.appendChild(categorySpan);
    li.appendChild(dueDateSpan);
    li.appendChild(dltbtn);
  });
}

// delet button function
async function deleteTask(id) {
  await fetch(`https://todolist-usingexpressandmongo-3.onrender.com/api/todos/${id}`, {
    method: "DELETE",
  });
  readonly();
}

// update function
async function updateTask(id , data) {
  await fetch(`https://todolist-usingexpressandmongo-3.onrender.com/api/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  await readonly();
}

allBtn.addEventListener("click", () => {
  currentFLiter = "all";
  readonly();
});
pendingBtn.addEventListener("click", () => {
  currentFLiter = "pending";
  readonly();
});
completedBtn.addEventListener("click", () => {
  currentFLiter = "completed";
  readonly();
});

// search task
searchInput.addEventListener("input", () => {
  readonly();
});

// keys
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.target === date) {
      e.preventDefault();
    }
    addBtn.click();
  }
});

// category filter
function populateCategories(tasks) {
  const uniqueCategories = new Set();

  tasks.forEach((task) => {
    if (task.category) {
      uniqueCategories.add(task.category.toLowerCase());
    }
  });

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
    categoryFilter.value = currentCategory;
  });
}

categoryFilter.addEventListener("change", applyCategory);
categoryFilter.addEventListener("click", applyCategory);
function applyCategory() {
  currentCategory = categoryFilter.value.toLowerCase().trim();
  categoryFilter.value = currentCategory;
  console.log("selected:", currentCategory);
  readonly();
}
