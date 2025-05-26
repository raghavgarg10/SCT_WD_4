let tasks = [];
let currentFilter = 'all';

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
}

function showTaskSection() {
  document.getElementById('filterSection').classList.remove('hidden');
  document.getElementById('taskList').classList.remove('hidden');
}

function renderTasks() {
  const taskList = document.getElementById('taskList');

  if (tasks.length === 0) {
    document.getElementById('filterSection').classList.add('hidden');
    document.getElementById('taskList').classList.add('hidden');
    return;
  }

  showTaskSection();
  taskList.innerHTML = '';

  let filteredTasks = tasks;
  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  if (filteredTasks.length === 0) {
    const msg = currentFilter === 'pending' ? 'No pending tasks' : 'No completed tasks';
    taskList.innerHTML = `<div style="text-align:center;color:#666;padding:20px;">${msg}</div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const index = tasks.indexOf(task);
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task' + (task.completed ? ' completed' : '');

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';
    infoDiv.innerHTML = `<strong>${task.title}</strong><small>${formatDateTime(task.dateTime)}</small>`;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const completeBtn = document.createElement('button');
    completeBtn.innerText = task.completed ? 'Undo' : 'Done';
    completeBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskDiv.appendChild(infoDiv);
    taskDiv.appendChild(actions);

    taskList.appendChild(taskDiv);
  });
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(filter + 'Btn').classList.add('active');
  renderTasks();
}

function addTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const dateTime = document.getElementById('taskDateTime').value;

  if (!title || !dateTime) {
    alert('Please enter task title and date/time');
    return;
  }

  tasks.push({ title, dateTime, completed: false });
  renderTasks();
  clearInputs();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDateTime').value = task.dateTime;
  tasks.splice(index, 1);
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function clearInputs() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDateTime').value = '';
}

renderTasks();
