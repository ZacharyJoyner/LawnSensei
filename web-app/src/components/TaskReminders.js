import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskReminders.css';

const TaskReminders = () => {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  const setReminder = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      const reminderMessage = `Reminder: ${task.title} is due soon!`;
      setReminders(prevReminders => [
        ...prevReminders,
        { id: reminders.length + 1, message: reminderMessage }
      ]);
      alert('Reminder set!');
    }
  };

  return (
    <div className="task-reminders">
      <h2>Task Reminders</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title}</span>
            <button onClick={() => setReminder(task.id)}>Set Reminder</button>
          </li>
        ))}
      </ul>
      {reminders.length > 0 && (
        <div className="reminders">
          {reminders.map(reminder => (
            <div key={reminder.id} className="reminder">
              {reminder.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskReminders;
