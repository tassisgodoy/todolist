import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, listTasks, updateTask } from './api.js';
import { sortTasks } from './dates.js';
import useDebounce from './useDebounce.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ open: false, task: null });

  const debouncedSearch = useDebounce(search, 400);

  const load = useCallback(async () => {
    try {
      const data = await listTasks(debouncedSearch);
      setTasks(data.tasks);
      setTotal(data.total);
      setCompleted(data.completed);
      setError('');
    } catch {
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3333.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);

  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(data) {
    if (modal.task) await updateTask(modal.task.id, data);
    else await createTask(data.title, data.dueDate);
    setModal({ open: false, task: null });
    await load();
  }

  const closeModal = useCallback(() => setModal({ open: false, task: null }), []);

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <h1>TODOLIST</h1>
          <p className="counters">
            <span><strong>{total}</strong> tarefas</span>
            <span><strong>{completed}</strong> concluídas</span>
          </p>
        </header>

        <div className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            placeholder="Buscar tarefas"
            aria-label="Buscar tarefas"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="banner" role="alert">{error}</p>}

        {!loading && !error && sorted.length === 0 ? (
          <div className="empty">
            <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
              <rect x="12" y="8" width="40" height="48" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M22 24h20 M22 34h20 M22 44h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p>You have no pending tasks.</p>
          </div>
        ) : (
          <ul className="list">
            {sorted.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => setModal({ open: true, task: t })}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <button type="button" className="fab" aria-label="Criar tarefa" onClick={() => setModal({ open: true, task: null })}>
        +
      </button>

      {modal.open && <TaskModal task={modal.task} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
}
