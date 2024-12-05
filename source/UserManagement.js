import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import './UserManagement.css';  // Import the CSS file for styling

const UserManagement = () => {
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

  // Fetch users from the backend
  useEffect(() => {
    fetch('http://localhost:3003/api/users')
      .then((response) => response.json())
      .then((data) => setUserList(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle adding a new user
  const handleAddUser = async () => {
    if (newUser.username && newUser.password && newUser.role) {
      try {
        const response = await fetch('http://localhost:3003/api/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });

        const result = await response.json();
        if (response.ok) {
          setUserList((prevUserList) => [...prevUserList, result.user]);  // Update user list
          setShowModal(false); // Close modal
          setNewUser({ username: '', password: '', role: '' }); // Reset form
        } else {
          alert(result.error || 'Error adding user');
        }
      } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user');
      }
    } else {
      alert('All fields are required');
    }
  };

  // Handle removing a user
  const handleRemoveUser = async (username) => {
    try {
      const response = await fetch(`http://localhost:3003/api/users/remove/${username}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        setUserList((prevUserList) => prevUserList.filter((user) => user.username !== username)); // Update state to remove user
      } else {
        alert(result.error || 'Error removing user');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Error removing user');
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-list mt-4">
        <h2>User Management</h2>
        <Table striped bordered hover className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="danger" onClick={() => handleRemoveUser(user.username)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add New User Button */}
      <Button variant="primary" onClick={() => setShowModal(true)} className="add-user-btn">
        Add New User
      </Button>

      {/* Modal to Add New User */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
