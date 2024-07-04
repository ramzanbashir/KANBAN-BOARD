var taskCounter = 0;

function addTask(listId) {
    var taskInput = document.querySelector(`#${listId}`).parentNode.querySelector('input[type="text"]');
    var taskText = taskInput.value.trim();
    if (taskText !== '') {
        var newTask = document.createElement('div');
        newTask.className = 'task';
        newTask.draggable = true;
        newTask.id = 'task-' + taskCounter++;
        newTask.innerHTML = `
            <span>${taskText}</span>
            <div class="buttons">
                <button onclick="editTask(this)">Edit</button>
                <button onclick="deleteTask(this)">Delete</button>
                <button onclick="moveToInProgress(this)">In Progress</button>
                <button onclick="moveToDone(this)">Done</button>
            </div>
        `;
        newTask.addEventListener('dragstart', dragStart);
        document.getElementById(listId).appendChild(newTask);
        taskInput.value = '';
    }
}

function editTask(button) {
    var task = button.closest('.task');
    var newTaskText = prompt('Edit task:', task.querySelector('span').textContent);
    if (newTaskText !== null) {
        task.querySelector('span').textContent = newTaskText;
    }
}

function deleteTask(button) {
    var task = button.closest('.task');
    task.remove();
}

function moveToInProgress(button) {
    var task = button.closest('.task');
    var inProgressList = task.closest('.board').querySelector('.column:nth-child(2) .task-list');
    inProgressList.appendChild(task);
    task.querySelector('.buttons').innerHTML = `
        <button onclick="moveToDone(this)">Done</button>
    `;
}

function moveToDone(button) {
    var task = button.closest('.task');
    var doneList = task.closest('.board').querySelector('.column:nth-child(3) .task-list');
    doneList.appendChild(task);
    task.querySelector('.buttons').innerHTML = '';
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.style.display = 'none';
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData('text');
    var draggableElement = document.getElementById(id);
    var dropzone = event.target.closest('.task-list');
    dropzone.appendChild(draggableElement);
    draggableElement.style.display = 'flex';
}

document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', dragOver);
    list.addEventListener('drop', drop);
});

function addBoard() {
    var boardContainer = document.getElementById('boards-container');
    var newBoard = document.createElement('div');
    newBoard.className = 'board';
    newBoard.innerHTML = `
        <div class="column">
            <h2>To Do</h2>
            <div class="task-list"></div>
            <input type="text" placeholder="New Task">
            <button onclick="addTask(this.previousElementSibling.previousElementSibling.id)">Add Task</button>
        </div>
        <div class="column">
            <h2>In Progress</h2>
            <div class="task-list"></div>
            <input type="text" placeholder="New Task">
            <button onclick="addTask(this.previousElementSibling.previousElementSibling.id)">Add Task</button>
        </div>
        <div class="column">
            <h2>Done</h2>
            <div class="task-list"></div>
            <input type="text" placeholder="New Task">
            <button onclick="addTask(this.previousElementSibling.previousElementSibling.id)">Add Task</button>
        </div>
    `;
    boardContainer.appendChild(newBoard);
    assignIds(newBoard);
}

function assignIds(board) {
    board.querySelectorAll('.task-list').forEach((list, index) => {
        list.id = 'task-list-' + Date.now() + '-' + index;
    });
}
