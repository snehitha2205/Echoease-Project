import React from 'react';
import Avatar from 'react-avatar';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; // Make sure to import the CSS file

const UserProfile = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the session and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to the login page
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>; // Handle case where user data is not yet available
  }

  return (
    <div className="user-profile-container">
      <Avatar name={user.username} size="100" round={true} className="user-avatar" />
      <div className="user-details">
        <p><strong>UserName: </strong>{user.username}</p>
        <p><strong>Role: </strong>{user.role}</p>
        <p><strong>Password: </strong>{user.password}</p>
      </div>
      <Button className="logout-button" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
};

export default UserProfile;
