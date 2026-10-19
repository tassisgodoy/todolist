const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = 'Algo deu errado. Tente novamente.';
    try {
      const data = await res.json();
      if (data.message) message = data.message;
    } catch {
      /* resposta sem corpo */
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

export const listTasks = (search = '') =>
  request(`/api/tasks?search=${encodeURIComponent(search)}`);

export const createTask = (title, dueDate) =>
  request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });

export const updateTask = (id, data) =>
  request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deleteTask = (id) => request(`/api/tasks/${id}`, { method: 'DELETE' });
