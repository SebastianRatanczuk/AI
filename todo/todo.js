function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

class Task {
    code;
    name;
    date;
    id;

    constructor(code, name, date) {
        this.code = code;
        this.name = name;
        this.date = date;
        this.id = uuidv4();
    }

    validate() {
        if (!this.code.match("^[A-Z]\\d{2}$")) {
            return false;
        }

        let tasks = JSON.parse(window.localStorage.getItem('task'));
        if (tasks != null) {
            var index = tasks.findIndex(item => item.code === this.code);
            if (index !== -1) {
                if (tasks[index].id !== this.id)
                    return false;
            }
        }

        if (!(2 < this.name.length && this.name.length < 255)) {
            return false;
        }

        if (this.date) {
            return new Date(this.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
        }

        return true;
    }
}

function resetInsert() {
    document.getElementById('kod_insert').value = "";
    document.getElementById('nazwa_insert').value = "";
    document.getElementById('data_insert').value = "";
}

function resetSearch() {
    document.getElementById('kod_search').value = "";
    document.getElementById('nazwa_search').value = "";
    document.getElementById('data_search').value = "";

    updateList();
}

function updateList() {
    let tasks = JSON.parse(window.localStorage.getItem('task'));
    printTasks(tasks)
}

function insertIntoList() {
    var kod = document.getElementById('kod_insert').value;
    var nazwa = document.getElementById('nazwa_insert').value;
    var data = document.getElementById('data_insert').value;
    var task = new Task(kod, nazwa, data);
    if (task.validate()) {
        storeTask(task);
        updateList();
    } else {
        alert("Niepoprawna weryfikacja");
    }
}

function storeTask(task) {
    let tasks = JSON.parse(window.localStorage.getItem('task'));
    tasks = tasks === null ? [] : tasks;
    window.localStorage.setItem('task', JSON.stringify([...tasks, task]));
}

function deleteTask(taskId) {
    let tasks = JSON.parse(window.localStorage.getItem('task'));
    var index = tasks.findIndex(item => item.id === taskId);
    if (index > -1) {
        tasks.splice(index, 1);
    }
    window.localStorage.setItem('task', JSON.stringify([...tasks]));
    updateList();
}

function filterTasks() {
    var kod = document.getElementById('kod_search').value;
    var nazwa = document.getElementById('nazwa_search').value;
    var data = document.getElementById('data_search').value;
    let tasks = JSON.parse(window.localStorage.getItem('task'));

    tasks = tasks.filter(item => item.code.includes(kod))
        .filter(item => item.name.includes(nazwa))
        .filter(item => !data ||
            !item.date ||
            new Date(item.date).setHours(0, 0, 0, 0) <= new Date(data).setHours(0, 0, 0, 0)
        )

    printTasks(tasks)
}

function printTasks(tasks) {
    if (tasks) {
        var table = document.getElementById("table");
        table.innerHTML = "<table id=\"table\">\n" +
            "        <tr>\n" +
            "            <th>Kod:</th>\n" +
            "            <th>Zadanie:</th>\n" +
            "            <th>Termin:</th>\n" +
            "            <th>Akcja:</th>\n" +
            "        </tr>\n" +
            "    </table>"

        tasks.forEach(task => {
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);

            var codeField = document.createElement('input');
            codeField.type = "text";
            codeField.value = task.code;
            codeField.readOnly = true;
            cell1.appendChild(codeField);

            var nameField = document.createElement('input');
            nameField.type = "text";
            nameField.value = task.name;
            nameField.readOnly = true;
            cell2.appendChild(nameField);

            var dateField = document.createElement('input');
            dateField.type = "text";
            dateField.value = task.date;
            dateField.readOnly = true;
            cell3.appendChild(dateField);

            var editButton = document.createElement('input');
            editButton.type = "button";
            editButton.value = "Edytuj";
            editButton.addEventListener('click', ev => {
                var newCodeField = document.createElement('input');
                newCodeField.type = "text";
                newCodeField.value = task.code;
                newCodeField.readOnly = false;
                newCodeField.maxLength = 3;
                cell1.replaceChild(newCodeField, codeField);

                var newNameField = document.createElement('input');
                newNameField.type = "text";
                newNameField.value = task.name;
                newNameField.readOnly = false;
                newNameField.maxLength = 255;
                cell2.replaceChild(newNameField, nameField);

                var newDateField = document.createElement('input');
                newDateField.type = "date";
                newDateField.value = task.date;
                newDateField.readOnly = false;
                cell3.replaceChild(newDateField, dateField);

                var updateButton = document.createElement('input');
                updateButton.type = "button";
                updateButton.value = "Zapisz";
                updateButton.addEventListener('click', function () {
                    var newTask = new Task(newCodeField.value, newNameField.value, newDateField.value);
                    newTask.id = task.id;
                    if (newTask.validate()) {
                        let tasks = JSON.parse(window.localStorage.getItem('task'));
                        tasks = tasks === null ? [] : tasks;
                        var index = tasks.findIndex(task => task.id === newTask.id);
                        tasks[index] = newTask;
                        window.localStorage.setItem('task', JSON.stringify([...tasks]));
                        updateList();
                    } else {
                        alert("Niepoprawna weryfikacja");
                    }
                });
                cell4.replaceChild(updateButton, editButton);

                var cancelButton = document.createElement('input');
                cancelButton.type = "button";
                cancelButton.value = "Esc";
                cancelButton.addEventListener('click', function () {
                    updateList();
                });
                cell4.replaceChild(cancelButton, deleteButton);
            });
            cell4.appendChild(editButton);

            var deleteButton = document.createElement('input');
            deleteButton.type = "button";
            deleteButton.value = "Usun";
            deleteButton.addEventListener('click', function () {
                deleteTask(task.id);
            });
            cell4.appendChild(deleteButton);
        })
    }
}

window.onload = updateList();