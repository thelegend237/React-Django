import React, { useState, useEffect } from "react";
import axios from "axios";
import './Notification.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/notifications")
      .then(response => setNotifications(response.data.notifications))
      .catch(error => console.error("Erreur lors de la récupération des notifications", error));
  }, []);

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <p>{notification}</p>
            <span>{new Date().toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
