// due_date chega do backend como 'YYYY-MM-DD' (às vezes com hora)
export const toDateOnly = (value) => (value ? String(value).slice(0, 10) : '');

export function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isOverdue(task) {
  const due = toDateOnly(task.due_date);
  return !task.completed && !!due && due < todayStr();
}

export function formatDate(value) {
  const [y, m, d] = toDateOnly(value).split('-');
  return y ? `${d}/${m}/${y}` : '';
}

// Data mais próxima primeiro; sem data vão para o fim
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const da = toDateOnly(a.due_date);
    const db = toDateOnly(b.due_date);
    if (da && db) return da.localeCompare(db);
    if (da) return -1;
    if (db) return 1;
    return 0;
  });
}
