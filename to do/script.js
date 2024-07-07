// Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Function on window load
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

// Function to Display The Tasks
const displayTasks = () => {
  tasksDiv.style.display = Object.keys(localStorage).length > 0 ? "inline-block" : "none";

  // Clear the tasks
  tasksDiv.innerHTML = "";

  // Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage).sort();

  tasks.forEach((key) => {
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.style.visibility = JSON.parse(value) ? "hidden" : "visible";
    if (JSON.parse(value)) taskInnerDiv.classList.add("completed");

    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  });

  // Tasks completed
  document.querySelectorAll(".task").forEach((element) => {
    element.onclick = () => {
      updateStorage(element.id.split("_")[0], element.innerText, !element.classList.contains("completed"));
    };
  });

  // Edit Tasks
  document.querySelectorAll(".edit").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableButtons(true);
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      updateNote = parent.id;
      parent.remove();
    });
  });

  // Delete Tasks
  document.querySelectorAll(".delete").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

// Disable Edit Button
const disableButtons = (bool) => {
  document.querySelectorAll(".edit").forEach((element) => {
    element.disabled = bool;
  });
};

// Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

// Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

// Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    if (updateNote == "") {
      // New task
      updateStorage(count, newTaskInput.value, false);
    } else {
      // Update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});
