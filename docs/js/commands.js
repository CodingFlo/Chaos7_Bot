function applyRowAnimation(delay = 0.8) {
    const rows = document.querySelectorAll('#command-table-body tr');
    rows.forEach((row, index) => {
        row.classList.remove('animated');
        void row.offsetWidth;
        row.classList.add('animated');
        row.style.animationDelay = (delay + index * 0.05) + 's';
    });
}
const tableBody = document.getElementById('command-table-body');
const headers = document.querySelectorAll('th[id^="sort-"]');
let sortedColumnId = null;
let sortOrder = 'asc';
headers.forEach(header => {
    header.addEventListener('click', () => {
        const columnId = header.id;
        if (sortedColumnId === columnId) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            sortOrder = 'asc';
            if (sortedColumnId) {
                document.getElementById(sortedColumnId).classList.remove('sorted');
            }
        }
        sortedColumnId = columnId;
        header.classList.add('sorted');
        const columnIndex = header.cellIndex;
        const rows = Array.from(tableBody.rows);
        const sortedRows = rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim().toLowerCase();
            const bText = b.cells[columnIndex].textContent.trim().toLowerCase();
            let comparison = 0;
            if (columnId === 'sort-shortcut') {
                const aIsSpecial = !/^[a-z0-9]/.test(aText);
                const bIsSpecial = !/^[a-z0-9]/.test(bText);
                if (aIsSpecial && !bIsSpecial) {
                    comparison = -1;
                } else if (!aIsSpecial && bIsSpecial) {
                    comparison = 1;
                } else {
                    comparison = aText.localeCompare(bText);
                }
            } else {
                comparison = aText.localeCompare(bText);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        sortedRows.forEach(row => tableBody.appendChild(row));
        applyRowAnimation(0);
        document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
        if (header.querySelector('.sort-icon')) {
            header.querySelector('.sort-icon').textContent = sortOrder === 'asc' ? ' ▲' : ' ▼';
        }
    });
});
