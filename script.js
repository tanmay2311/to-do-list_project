const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const dueDate = document.getElementById("due-date");
const priority = document.getElementById("priority");
const themeToggle = document.getElementById('theme-toggle');
const completionPercentage = document.getElementById("completion-percentage");
const progressBarFill = document.getElementById("progress-bar-fill");

let editMode = false;
let editIndex = -1;

function addTask() {
    if (inputBox.value === '' || dueDate.value === '') {
        alert("You must write something and set a due date!");
    } else {
        if (editMode) {
            updateTask(editIndex, inputBox.value, dueDate.value, priority.value);
        } else {
            let li = document.createElement("li");
            li.innerHTML = `${inputBox.value} - ${dueDate.value} - Priority: ${priority.value}`;
            listContainer.appendChild(li);
            let span = document.createElement("span");
            span.innerHTML = "\u00d7";
            li.appendChild(span);

            const taskData = {
                text: inputBox.value,
                due: dueDate.value,
                priority: priority.value,
                completed: false
            };
            saveData(taskData);
        }
        inputBox.value = "";
        dueDate.value = "";
        priority.value = "low";
        editMode = false;
        editIndex = -1;
    }
    updateProgress();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        updateTaskStatus(e.target.innerHTML.split(" - ")[0]);
    } else if (e.target.tagName === "SPAN") {
        removeTask(e.target.parentElement.innerHTML.split(" - ")[0]);
        e.target.parentElement.remove();
    } else if (e.target.tagName === "BUTTON") {
        editTask(e.target.parentElement);
    }
    updateProgress();
}, false);

function saveData(taskData) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskData);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTask();
    updateProgress();
}

function showTask() {
    listContainer.innerHTML = '';
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${task.text} - ${task.due} - Priority: ${task.priority} <button>Edit</button>`;
        if (task.completed) {
            li.classList.add("checked");
        }
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    });
    updateProgress();
}

function updateTaskStatus(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgress();
}

function editTask(taskElement) {
    let taskText = taskElement.innerHTML.split(" - ")[0];
    let taskDue = taskElement.innerHTML.split(" - ")[1];
    let taskPriority = taskElement.innerHTML.split("Priority: ")[1].split(" <button")[0];
    inputBox.value = taskText;
    dueDate.value = taskDue;
    priority.value = taskPriority;
    editMode = true;
    editIndex = Array.from(listContainer.children).indexOf(taskElement);
}

function updateTask(index, text, due, priority) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index] = { text, due, priority, completed: tasks[index].completed };
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTask();
}

function filterTasks(status) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    listContainer.innerHTML = '';
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `${task.text} - ${task.due} - Priority: ${task.priority} <button>Edit</button>`;
        if (status === 'completed' && task.completed) {
            listContainer.appendChild(li);
        } else if (status === 'pending' && !task.completed) {
            listContainer.appendChild(li);
        } else if (status === 'all') {
            listContainer.appendChild(li);
        }
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    });
}

function updateProgress() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = tasks.filter(task => task.completed).length;
    let totalTasks = tasks.length;
    let percentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    completionPercentage.innerHTML = `${percentage}% completed`;
    progressBarFill.style.width = `${percentage}%`;
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

showTask();
