import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import './LawnRecommendationsDashboard.css';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const LawnRecommendationsDashboard = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [notifications, setNotifications] = useState([]); // New state for notifications

  useEffect(() => {
    // Fetch suggestions and tasks from the backend API
    fetch('/api/suggestions')
      .then(response => response.json())
      .then(data => setSuggestions(data))
      .catch(error => console.error('Error fetching suggestions:', error));

    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));

    const fetchNotifications = async () => {
      const mockNotifications = [
        { id: 1, message: 'Don’t forget to fertilize your lawn this weekend!' },
        { id: 2, message: 'New lawn care tips available.' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const handleTaskChange = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to handle date change
  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const setReminder = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      const reminderMessage = `Reminder: ${task.title} is due soon!`;
      setNotifications(prevNotifications => [
        ...prevNotifications,
        { id: notifications.length + 1, message: reminderMessage }
      ]);
      alert('Reminder set!');
    }
  };

  return (
    <div className="lawn-recommendations-dashboard">
      <h2>Personalized Lawn Care Suggestions</h2>
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-card">
            <img src={suggestion.imageUrl} alt={suggestion.name} />
            <h3>{suggestion.name}</h3>
            <p>{suggestion.description}</p>
            <button onClick={() => window.location.href = suggestion.link}>Buy Now</button>
          </div>
        ))}
      </div>

      <h2>Scheduled Tasks</h2>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id} className="task">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => handleTaskChange(task.id)} 
            />
            <label>{task.title}</label>
            <button onClick={() => setReminder(task.id)}>Set Reminder</button>
          </div>
        ))}
      </div>

      <h2>Calendar View</h2>
      <div className="calendar-view">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
        />
        <div className="tasks-for-date">
          <h3>Tasks for {selectedDate.toDateString()}</h3>
          {tasks.filter(task => new Date(task.date).toDateString() === selectedDate.toDateString()).map(task => (
            <div key={task.id} className="task">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => handleTaskChange(task.id)} 
              />
              <label>{task.title}</label>
            </div>
          ))}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className="notification">
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LawnRecommendationsDashboard;
