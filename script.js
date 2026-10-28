document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <span>${task.text}</span>
                <div class="actions">
                    <button class="complete-btn" onclick="toggleTask(${index})">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text !== '') {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveAndRender();
        }
    });

    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    renderTasks();
});
