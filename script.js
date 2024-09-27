// script.js
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
});

function generateTables() {
    const processes = document.getElementById('processes').value;
    const resources = document.getElementById('resources').value;
    const tablesDiv = document.getElementById('tables');
    tablesDiv.innerHTML = '';

    const maxTable = createTable('Max', processes, resources);
    const allocationTable = createTable('Asignación', processes, resources);
    const availableTable = createTable('Disponibilidad', 1, resources);

    tablesDiv.appendChild(maxTable);
    tablesDiv.appendChild(allocationTable);
    tablesDiv.appendChild(availableTable);

    document.getElementById('calculateBtn').style.display = 'block';
}

function createTable(title, rows, cols) {
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = title;
    table.appendChild(caption);

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (let i = 0; i <= cols; i++) {
        const th = document.createElement('th');
        th.textContent = i === 0 ? '' : `R${i}`;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j <= cols; j++) {
            const td = document.createElement('td');
            if (j === 0) {
                td.textContent = `P${i + 1}`;
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.required = true;
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    return table;
}

function calculateSafeState() {
    const processes = parseInt(document.getElementById('processes').value);
    const resources = parseInt(document.getElementById('resources').value);

    const max = getTableData('Max', processes, resources);
    const allocation = getTableData('Asignación', processes, resources);
    const available = getTableData('Disponibilidad', 1, resources)[0];

    const safeSequence = isSafeState(processes, resources, max, allocation, available);
    const app = document.getElementById('app');
    if (safeSequence) {
        app.innerHTML += `<p>El sistema está en un estado seguro. Secuencia segura: ${safeSequence.join(', ')}</p>`;
    } else {
        app.innerHTML += '<p>El sistema no está en un estado seguro.</p>';
    }
}

function getTableData(title, rows, cols) {
    const table = Array.from(document.getElementsByTagName('caption')).find(caption => caption.textContent === title).parentElement;
    const data = [];
    const tbody = table.querySelector('tbody');
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 1; j <= cols; j++) {
            const input = tbody.rows[i].cells[j].querySelector('input');
            if (input) {
                row.push(parseInt(input.value) || 0);
            }
        }
        data.push(row);
    }
    return data;
}

function isSafeState(processes, resources, max, allocation, available) {
    const work = [...available];
    const finish = Array(processes).fill(false);
    const safeSequence = [];

    let found;
    do {
        found = false;
        for (let i = 0; i < processes; i++) {
            if (!finish[i]) {
                let j;
                for (j = 0; j < resources; j++) {
                    if (max[i][j] - allocation[i][j] > work[j]) {
                        break;
                    }
                }
                if (j === resources.length) {
                    for (let k = 0; k < resources.length; k++) {
                        work[k] += allocation[i][k];
                    }
                    safeSequence.push(`P${i + 1}`);
                    finish[i] = true;
                    found = true;
                }
            }
        }
    } while (found);

    return finish.every(f => f) ? safeSequence : null;
}
