let timerDisplay = document.getElementById("timer");
let startPauseBtn = document.getElementById("start-pause");
let resetBtn = document.getElementById("reset");
let setTimerBtn = document.getElementById("set-timer");
let toggleSetTimerBtn = document.getElementById("toggle-set-timer");
let setMinutesInput = document.getElementById("set-minutes");

let todoList = document.getElementById("todo-list");
let completedList = document.getElementById("completed-list");
let newTaskInput = document.getElementById("new-task");
let addTaskBtn = document.getElementById("add-task");

let activeTabBtn = document.getElementById("active-tab");
let completedTabBtn = document.getElementById("completed-tab");

let timerInterval;
let timeRemaining = 25 * 60; // 25 minutes by default
let isPaused = true;
let isRunning = false;
let isSettingTimer = false; // Keep track of whether "Set Timer" is active

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

// Function to format time into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update the timer display
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
}

// Start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startPauseBtn.textContent = "Start"; // Reset to "Start"
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

// Toggle between Start and Pause
startPauseBtn.addEventListener("click", function () {
    if (isRunning) {
        pauseTimer();
        startPauseBtn.textContent = "Resume";
    } else {
        startTimer();
        startPauseBtn.textContent = "Pause";
    }
});

// Reset the timer
resetBtn.addEventListener("click", function () {
    pauseTimer();
    timeRemaining = 25 * 60; // Reset to 25 minutes by default
    updateTimerDisplay();
    startPauseBtn.textContent = "Start";
});

// Toggle visibility of Set Timer input and button
toggleSetTimerBtn.addEventListener("click", function () {
    isSettingTimer = !isSettingTimer;
    setMinutesInput.classList.toggle("hidden");
    setTimerBtn.classList.toggle("hidden");
    toggleSetTimerBtn.textContent = isSettingTimer ? "Cancel" : "Set Timer";
});

// Apply custom time and hide input when setting the timer
setTimerBtn.addEventListener("click", function () {
    const customMinutes = parseInt(setMinutesInput.value);
    if (!isNaN(customMinutes) && customMinutes > 0) {
        timeRemaining = customMinutes * 60; // Set custom time in seconds
        updateTimerDisplay();
        startPauseBtn.textContent = "Start"; // Reset to "Start" after setting the time
        pauseTimer(); // Stop the timer if it's running
        setMinutesInput.classList.add("hidden");
        setTimerBtn.classList.add("hidden");
        toggleSetTimerBtn.textContent = "Set Timer";
        isSettingTimer = false;
    }
});

// Initialize the timer display
updateTimerDisplay();

// Load tasks from localStorage and display them
function loadTasks() {
    todoList.innerHTML = ""; // Clear the list first
    completedList.innerHTML = ""; // Clear the completed list first

    tasks.forEach((task, index) => {
        addTaskToDOM(task, index, false); // Add each active task to DOM
    });

    completedTasks.forEach((task, index) => {
        addTaskToDOM(task, index, true); // Add each completed task to DOM
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

// Function to add a new task
function addTask() {
    const taskText = newTaskInput.value;
    if (taskText.trim() === "") return;

    tasks.push(taskText); // Add to active tasks array
    saveTasks(); // Save updated tasks to localStorage
    loadTasks(); // Reload tasks
    newTaskInput.value = ""; // Clear input field
}

// Add task button functionality
addTaskBtn.addEventListener("click", addTask);

// Enter key triggers task addition
newTaskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Function to add a task to the DOM (handles both active and completed tasks)
function addTaskToDOM(taskText, index, isCompleted) {
    const taskItem = document.createElement("li");
    taskItem.textContent = taskText;

    if (!isCompleted) {
        // For active tasks
        const completeButton = document.createElement("button");
        completeButton.textContent = "Complete";
        completeButton.classList.add("complete-btn");
        taskItem.appendChild(completeButton);

        // Mark task as complete
        completeButton.addEventListener("click", function () {
            tasks.splice(index, 1); // Remove from active tasks
            completedTasks.push(taskText); // Add to completed tasks
            saveTasks();
            loadTasks(); // Reload tasks after changes
        });

        todoList.appendChild(taskItem);
    } else {
        // For completed tasks (with delete button)
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        taskItem.appendChild(deleteButton);

        // Delete task from completed tasks
        deleteButton.addEventListener("click", function () {
            completedTasks.splice(index, 1); // Remove from completed tasks
            saveTasks();
            loadTasks(); // Reload tasks after changes
        });

        completedList.appendChild(taskItem);
    }
}

// Switch between active and completed tasks tabs
activeTabBtn.addEventListener("click", function () {
    completedList.classList.add("hidden");
    todoList.classList.remove("hidden");
    activeTabBtn.classList.add("active");
    completedTabBtn.classList.remove("active");
});

completedTabBtn.addEventListener("click", function () {
    todoList.classList.add("hidden");
    completedList.classList.remove("hidden");
    completedTabBtn.classList.add("active");
    activeTabBtn.classList.remove("active");
});

// Load tasks on page load
loadTasks();
