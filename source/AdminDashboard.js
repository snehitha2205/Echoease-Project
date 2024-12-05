import React, { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import ActiveUsers from './ActiveUsers';
import './dashboard.css';
import UserManagement from './UserManagement';
import FeedbackManagement from './FeedbackManagement';
import MessagesReceived from './MessagesReceived';
const AdminDashboard = () => {
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState('Feedback Management');
  const location = useLocation(); // Correctly use useLocation to access location state
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState(location?.state?.user || null);

  // Effect for handling user login state
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Load from localStorage
      } else {
        navigate('/login'); // Redirect to login if no user found
      }
    }
  }, [user, navigate]);
  const handleNavLinkClick = (section) => {
    setActiveSection(section);
    handleClose(); // Close the sidebar when a link is clicked
  };

  return (
    <div className="d-flex">
      <div className="d-none d-lg-block sidebar">
        <nav className="flex-column">
          <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Feedback Management')}>
            <i className="fas fa-comment-alt"></i> Feedback Management {/* Icon for feedback */}
          </a>
          <a href="#" className="nav-link" onClick={() => handleNavLinkClick('User Management')}>
            <i className="fas fa-users-cog"></i> User Management {/* Icon for user management */}
          </a>
          <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Admin Profile')}>
            <i className="fas fa-user-shield"></i> Admin Profile {/* Icon for admin profile */}
          </a>
          <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Messages received')}>
            <i className="fas fa-envelope-open-text"></i> Messages Received {/* Icon for messages */}
          </a>
          <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Active Users')}>
            <i className="fas fa-users"></i> Active Users {/* Icon for active users */}
          </a>
        </nav>
      </div>

      <div className="d-lg-none mb-6">
        <button className="toggle-button" onClick={handleShow}>
          <i className="fas fa-bars fa-lg"></i> {/* Hamburger icon */}
        </button>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="bg-light">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sidebar</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav className="flex-column">
            <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Feedback Management')}>
              <i className="fas fa-comment-alt"></i> Feedback Management {/* Icon for feedback */}
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavLinkClick('User Management')}>
              <i className="fas fa-users-cog"></i> User Management {/* Icon for user management */}
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Admin Profile')}>
              <i className="fas fa-user-shield"></i> Admin Profile {/* Icon for admin profile */}
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Messages received')}>
              <i className="fas fa-envelope-open-text"></i> Messages Received {/* Icon for messages */}
            </a>
            <a href="#" className="nav-link" onClick={() => handleNavLinkClick('Active Users')}>
              <i className="fas fa-users"></i> Active Users {/* Icon for active users */}
            </a>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="content">
        {activeSection === 'Feedback Management' && <FeedbackManagement/>}
        {activeSection === 'User Management' && <UserManagement/>}
        {activeSection === 'Admin Profile' && <UserProfile user={user}/>}
        {activeSection === 'Messages received' && <MessagesReceived user={user}/>}
        {activeSection === 'Active Users' && <ActiveUsers/>} {/* Render Active Users */}
      </div>
    </div>
  );
};

export default AdminDashboard;
