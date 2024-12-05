import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';

const ActiveUsers = () => {
  const [users, setUsers] = useState(() => {
    // Get users from localStorage or use a default value
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  // Handle changing the user's active status
  const toggleActiveStatus = (username) => {
    const updatedUsers = users.map((user) =>
      user.username === username
        ? { ...user, active: !user.active }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Update localStorage
  };

  return (
    <div className="active-users-container">
      
      
      <div className="active-users-list">
        <Table striped bordered hover className="active-users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.username}
                className={`user-table-row ${user.active ? 'active' : 'inactive'}`}
              >
                <td>{user.username}</td>
                <td>
                  <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <Button
                    variant={user.active ? 'secondary' : 'success'}
                    onClick={() => toggleActiveStatus(user.username)}
                    className="toggle-status-btn"
                  >
                    {user.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ActiveUsers;
