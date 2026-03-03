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
const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let deleteId = null;
const API = "https://todolist-usingexpressandmongo-3.onrender.com/api/todos"
// const API = "http://localhost:5000/api/todos";
let currentFilter = "all";
let currentCategory = "all";

async function addTodo() {
  taskInput.style.border = "";
  taskCategory.style.border = "";

  if (!taskInput.value.trim()) {
    taskInput.style.border = "2px solid red";
    return;
  }
  if (!taskCategory.value.trim()) {
    taskCategory.style.border = "2px solid red";
    return;
  }
  const task = {
    text: taskInput.value.trim(),
    category: taskCategory.value.trim().toLowerCase(),
    due_date: date.value ? new Date(date.value) : new Date(),
    created_at: new Date(),
    completed_at: null,
  };

  try {
    setLoading(true);
    await axios.post(API, task);
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }

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
  try {
    let query = [];

    if (currentFilter !== "all") {
      query.push(`status=${currentFilter}`);
    }
    if (currentCategory !== "all") {
      query.push(`category=${currentCategory}`);
    }
    const queryString = query.length ? "?" + query.join("&") : "";
    const res = await axios.get(API + queryString);
    const task = res.data;

    // populateCategories(task);
    showTask(task);
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}

async function loadCategories() {
  const res = await axios.get(API);
  populateCategories(res.data);
}
readonly();
loadCategories();

function showTask(task) {
  tasklist.innerHTML = "";

  task.forEach((task) => {
    const query = searchInput.value.trim().toLowerCase();
    const matchSearch =
      task.text.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query);

    if (!matchSearch) return;

    const li = document.createElement("li");

    // dlt button
    const dltbtn = document.createElement("button");
    dltbtn.textContent = "✖";

    dltbtn.addEventListener("click", () => {
      deleteId = task._id;
confirmModal.style.display = "flex";
    });

    confirmYes.addEventListener("click", async () => {
  if (deleteId) {
    await deleteTask(deleteId);
    deleteId = null;
  }
  confirmModal.style.display = "none";
});

confirmNo.addEventListener("click", () => {
  deleteId = null;
  confirmModal.style.display = "none";
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
      updateTask(task._id, {
        completed_at: checkbox.checked ? new Date() : null,
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
  await axios.delete(`${API}/${id}`);
  readonly();
}

// update function
async function updateTask(id, data) {
  try {
    await axios.put(`${API}/${id}`, data);
    await readonly();
  } catch (error) {
    console.log("Update error:", error.message);
  }
}

allBtn.addEventListener("click", () => {
  currentFilter = "all";
  readonly();
});
pendingBtn.addEventListener("click", () => {
  currentFilter = "pending";
  readonly();
});
completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
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

// loading
const loading = document.getElementById("loading");

function setLoading(state) {
  if (state) {
    loading.style.display = "inline";
    allBtn.disable = true;
  } else {
    loading.style.display = "none";
    allBtn.disable = false;
  }
}
