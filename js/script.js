document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const todoContainer = document.getElementById('todo-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addTaskBtn = document.getElementById('add-task-btn');

    loginBtn.addEventListener('click', login);
    logoutBtn.addEventListener('click', logout);
    addTaskBtn.addEventListener('click', addTask);

    checkUserSession();

    function checkUserSession() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            showTodoContainer();
            loadTasks(currentUser);
        } else {
            showLoginContainer();
        }
    }

    function login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) {
            showError('Please enter both username and password.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            if (users[username].password === password) {
                localStorage.setItem('currentUser', username);
                showTodoContainer();
                loadTasks(username);
            } else {
                showError('Incorrect password.');
            }
        } else {
            users[username] = { password, tasks: [] };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            showTodoContainer();
            loadTasks(username);
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        showLoginContainer();
    }

    function addTask() {
        const taskInput = document.getElementById('new-task');
        const taskText = taskInput.value.trim();
        const taskTimeInput = document.getElementById('task-time');
        const taskTime = taskTimeInput.value.trim();

        if (!taskText || !taskTime) return;

        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${taskText}</span> <span class="time">${taskTime}</span>`;
        listItem.onclick = () => {
            listItem.remove();
            saveTasks();
        };
        taskList.appendChild(listItem);

        taskInput.value = "";
        taskTimeInput.value = "";
        saveTasks();
    }

    function saveTasks() {
        const currentUser = localStorage.getItem('currentUser');
        const tasks = [];
        const taskList = document.getElementById('task-list').getElementsByTagName('li');
        for (let task of taskList) {
            const taskText = task.getElementsByTagName('span')[0].textContent;
            const taskTime = task.getElementsByTagName('span')[1].textContent;
            tasks.push({ text: taskText, time: taskTime });
        }
        let users = JSON.parse(localStorage.getItem('users'));
        users[currentUser].tasks = tasks;
        localStorage.setItem('users', JSON.stringify(users));
    }

    function loadTasks(username) {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        let users = JSON.parse(localStorage.getItem('users'));
        const tasks = users[username].tasks || [];
        for (let task of tasks) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${task.text}</span> <span class="time">${task.time}</span>`;
            listItem.onclick = () => {
                listItem.remove();
                saveTasks();
            };
            taskList.appendChild(listItem);
        }
    }

    function showLoginContainer() {
        loginContainer.style.display = 'block';
        todoContainer.style.display = 'none';
    }

    function showTodoContainer() {
        loginContainer.style.display = 'none';
        todoContainer.style.display = 'block';
    }

    function showError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = message;
    }
});
