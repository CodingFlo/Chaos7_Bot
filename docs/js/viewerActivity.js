function applyRowAnimation() {
    const rows = document.querySelectorAll('#command-table-body tr');
    rows.forEach((row, index) => {
        row.classList.remove('animated');
        void row.offsetWidth;
        row.classList.add('animated');
        const delay = 0.3 + index * 0.02;
        row.style.animationDelay = `${delay}s`;
    });
}
let currentSortColumn = 'sort-rank';
let sortOrder = 'desc';
function sortTableByColumn(columnId) {
    const tableBody = document.getElementById('command-table-body');
    const header = document.getElementById(columnId);
    if (currentSortColumn !== columnId) {
        sortOrder = (columnId === 'sort-rank' || columnId === 'sort-activity' || columnId === 'sort-time') ? 'desc' : 'asc';
        const prevHeader = document.getElementById(currentSortColumn);
        if (prevHeader) {
            prevHeader.classList.remove('sorted');
            prevHeader.querySelector('.sort-icon').textContent = '';
        }
    } else {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    currentSortColumn = columnId;
    header.classList.add('sorted');
    const columnIndex = header.cellIndex;
    const rows = Array.from(tableBody.rows);
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent;
        const bText = b.cells[columnIndex].textContent;
        let comparison;
        if (columnId === 'sort-activity' || columnId === 'sort-rank') {
            const aValue = parseFloat(aText.replace(/[^0-9.]/g, ''));
            const bValue = parseFloat(bText.replace(/[^0-9.]/g, ''));
            comparison = aValue - bValue;
        } else if (columnId === 'sort-time') {
            const parseDuration = (durationStr) => {
                const parts = durationStr.match(/(d+)(d|h|m|s)/g);
                if (!parts) return 0;
                let totalMs = 0;
                parts.forEach(part => {
                    const value = parseInt(part.slice(0, -1));
                    const unit = part.slice(-1);
                    switch (unit) {
                        case 'd': totalMs += value * 24 * 60 * 60 * 1000; break;
                        case 'h': totalMs += value * 60 * 60 * 1000; break;
                        case 'm': totalMs += value * 60 * 1000; break;
                        case 's': totalMs += value * 1000; break;
                    }
                });
                return totalMs;
            };
            const aValue = parseDuration(aText);
            const bValue = parseDuration(bText);
            comparison = aValue - bValue;
        }
        else {
            comparison = aText.localeCompare(bText);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });
    sortedRows.forEach(row => tableBody.appendChild(row));
    applyRowAnimation();
    document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
    if (header.querySelector('.sort-icon')) {
        header.querySelector('.sort-icon').textContent = sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
}
document.getElementById('sort-username').onclick = () => sortTableByColumn('sort-username');
document.getElementById('sort-activity').onclick = () => sortTableByColumn('sort-activity');
document.getElementById('sort-rank').onclick = () => sortTableByColumn('sort-rank');
document.getElementById('sort-time').onclick = () => sortTableByColumn('sort-time');
document.addEventListener('DOMContentLoaded', () => {
    sortTableByColumn('sort-rank'); // Default sort on page load
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});
