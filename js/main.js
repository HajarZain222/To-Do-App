let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let deleteAll = document.querySelector(".delete-all");

let arrayOfTasks = [];

// Check if there's Tasks In Local Storage
if (localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
}

getDataFromLocalStorage();
toggleDeleteAllVisibility();

// Add new task
submit.onclick = function () {
    if (input.value !== "") {
        addTaskToArray(input.value);
        input.value = "";
    }
};

// Handle clicks on tasks (delete / toggle done)
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("del")) {
        deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
        e.target.parentElement.remove();
        toggleDeleteAllVisibility();
    }

    if (e.target.classList.contains("task")) {
        toggleStatusTaskWith(e.target.getAttribute("data-id"));
        e.target.classList.toggle("done");
    }
});

// Add new task to array
function addTaskToArray(taskText) {
    const task = {
        id: Date.now(),
        title: taskText,
        completed: false,
    };
    arrayOfTasks.push(task);
    addElementsToPageFrom(arrayOfTasks);
    addDataToLocalStorageFrom(arrayOfTasks);
    toggleDeleteAllVisibility();
}

// Render tasks in page
function addElementsToPageFrom(arrayOfTasks) {
    // clear tasks div except delete button
    tasksDiv.innerHTML = "";
    arrayOfTasks.forEach((task) => {
        let div = document.createElement("div");
        div.className = "task";
        if (task.completed) {
        div.className = "task done";
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));

        // Delete button for single task
        let span = document.createElement("span");
        span.className = "del";
        span.appendChild(document.createTextNode("Delete"));
        div.appendChild(span);
        tasksDiv.appendChild(div);
    });

    // Append Delete All button again at the bottom
    tasksDiv.appendChild(deleteAll);
}

// LocalStorage
function addDataToLocalStorageFrom(arrayOfTasks) {
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
    let data = window.localStorage.getItem("tasks");
    if (data) {
        let tasks = JSON.parse(data);
        addElementsToPageFrom(tasks);
    }
}

// Delete single task
function deleteTaskWith(taskId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
    addDataToLocalStorageFrom(arrayOfTasks);
}

// Toggle complete/incomplete
function toggleStatusTaskWith(taskId) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
        if (arrayOfTasks[i].id == taskId) {
        arrayOfTasks[i].completed = !arrayOfTasks[i].completed;
        }
    }
    addDataToLocalStorageFrom(arrayOfTasks);
}

// Delete all tasks
function deleteAllTasks() {
    arrayOfTasks = [];
    addDataToLocalStorageFrom(arrayOfTasks);
    tasksDiv.innerHTML = "";
    toggleDeleteAllVisibility();
}

// Delete All button functionality
deleteAll.addEventListener("click", () => {
    if (arrayOfTasks.length > 0) {
        if (confirm("Are you sure you want to delete all tasks?")) {
        deleteAllTasks();
        }
    }
});

// Show/Hide Delete All button dynamically
function toggleDeleteAllVisibility() {
    if (arrayOfTasks.length === 0) {
        deleteAll.style.display = "none";
    } else {
        deleteAll.style.display = "block";
    }
}
