import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import './Notifications.css';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch replies from the database that match the user's username
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`http://localhost:3003/api/reply?username=${user.username}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchReplies();
  }, [user.username]);

  
  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:3003/api/reply/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedNotifications = notifications.filter((notification) => notification._id !== id);
        setNotifications(updatedNotifications);
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  

  return (
    <div className="notifications">
      <h2>Notifications</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification._id} className={notification.read ? 'read' : 'unread'}>
              <td>Reply from Admin</td>
              <td>{notification.replyText}</td>
              <td>{new Date(notification.repliedAt).toLocaleString()}</td>
              <td>
                {/* <Button 
                  variant="success" 
                  onClick={() => handleMarkAsRead(notification._id)} 
                  disabled={notification.read}
                >
                  Mark as Read
                </Button> */}
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteNotification(notification._id)} 
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Notifications;
