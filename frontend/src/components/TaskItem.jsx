import { formatDate, isOverdue } from '../dates.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = !!task.completed;
  const overdue = isOverdue(task);

  return (
    <li className={`task ${done ? 'task--done' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`check ${done ? 'check--on' : ''}`}
        onClick={() => onToggle(task)}
      >
        {done && (
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="task__body">
        <span className={`task__title ${overdue ? 'task__title--overdue' : ''}`}>{task.title}</span>
        {task.due_date && <span className="task__date">{formatDate(task.due_date)}</span>}
      </div>

      {overdue && <span className="badge">Em atraso</span>}

      <div className="task__actions">
        <button type="button" className="icon-btn" aria-label={`Editar ${task.title}`} onClick={() => onEdit(task)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 20h4L19 9l-4-4L4 16v4z M14 6l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className="icon-btn icon-btn--danger" aria-label={`Excluir ${task.title}`} onClick={() => onDelete(task)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
