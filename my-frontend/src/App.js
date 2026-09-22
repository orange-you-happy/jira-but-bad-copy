import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: 'TO_DO' }),
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleStatus = async (task) => {
    const updatedStatus = task.status === 'DONE' ? 'TO_DO' : 'DONE';
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Task Manager</h2>

      {/* Form to create new tasks */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Task</button>
      </form>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            <span
              onClick={() => handleToggleStatus(task)}
              style={{
                cursor: 'pointer',
                textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task.id)} style={{ color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;