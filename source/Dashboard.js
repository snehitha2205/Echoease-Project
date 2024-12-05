import React, { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import UserProfile from './UserProfile';
import Feedback from './Feedback';
import ApplianceCard from './ApplianceCard';
import RecentActivity from './recentActivity';
import { useLocation, useNavigate } from 'react-router-dom';
import './dashboard.css';
import './recentActivity.css';
import ContactContent from './ContactContent';
import light from './light.webp';
import TV from './tv.jpeg';
import oven from './oven.webp';
import Fan from './fan.webp';
import PowerConsumption from './PowerConsumption';
import Notifications from './Notifications';
import FAQ from './Faq';
import axios from 'axios';
// Replace with your ESP32's IP address
const ESP32_URL = 'http://192.168.0.130:80/post';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [user, setUser] = useState(location?.state?.user || null);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  const [appliances, setAppliances] = useState([
    { id: 1, name: 'Living Room Light', status: true, image: light, activeTime: 0 },
    { id: 2, name: 'Living Room TV', status: false, image: TV, activeTime: 0 },
    { id: 3, name: 'Oven', status: true, image: oven, activeTime: 0 },
    { id: 4, name: 'Bedroom Fan', status: false, image: Fan, activeTime: 0 },
  ]);

  const [recentActivity, setRecentActivity] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  
  useEffect(() => {
    const fetchApplianceStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3003/appliance-status/');
        const updatedStatuses = response.data; // Assuming API returns an array of { id, status }
        
        setAppliances((prevAppliances) =>
          prevAppliances.map((appliance) => {
            const updatedAppliance = updatedStatuses.find(item => item.id === appliance.id);
            return updatedAppliance ? { ...appliance, status: updatedAppliance.status } : appliance;
          })
        );
      } catch (error) {
        console.error('Error fetching appliance statuses:', error);
      }
    };

    fetchApplianceStatus();
  }, []); // Run once on component mount


  

    

   const toggleAppliance = async (id, currentStatus) => {
    const newStatus = !currentStatus;
console.log(appliances);
    // Update local state immediately
    setAppliances((prev) =>
      prev.map((appliance) =>
        appliance.id === id ? { ...appliance, status: newStatus, activeTime: newStatus ? 1 : 0 } : appliance
      )
    );

    try {
      const response = await fetch(ESP32_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id.toString(),
          status: newStatus ? 'ON' : 'OFF',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Appliance ${id} status updated to ${newStatus ? 'ON' : 'OFF'} on ESP32.`);
      console.log(response);
    } catch (error) {
      console.error('Error communicating with ESP32:', error);
      alert('Failed to communicate with the ESP32. Please check the connection and try again.');

      // Revert the local status if the request fails
      setAppliances((prev) =>
        prev.map((appliance) =>
          appliance.id === id ? { ...appliance, status: currentStatus, activeTime: currentStatus ? 1 : 0 } : appliance
        )
      );
    }
  };
  




  
  const handleNavLinkClick = (e, section) => {
    e.preventDefault();
    setActiveSection(section);
    handleClose();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAppliances((prev) =>
        prev.map((appliance) => {
          if (appliance.status) {
            return { ...appliance, activeTime: appliance.activeTime + 1 };
          }
          return appliance;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newRecentActivity = appliances
      .filter((appliance) => appliance.status === 'ON') // Only include appliances with status 'ON'
      .map((appliance) => ({
        name: appliance.name,
        duration: appliance.activeTime, // Assuming activeTime represents how long the appliance has been ON
      }));
  
    setRecentActivity(newRecentActivity);
  }, [appliances]);
  

  return (
    <div className="d-flex parent">
      <div className="d-none d-lg-block sidebar">
        <nav className="flex-column">
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Dashboard')}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </a>
          {/* <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Power Consumption')}>
            <i className="fas fa-bolt"></i> Power Consumption
          </a> */}
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'User Profile')}>
            <i className="fas fa-user"></i> User Profile
          </a>
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Feedback')}>
            <i className="fas fa-comment-dots"></i> Feedback
          </a>
          
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Contact')}>
            <i className="fas fa-envelope"></i> Contact
          </a>
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Recent Activity')}>
            <i className="fas fa-history"></i> Active Devices
          </a>
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Notifications')}>
            <i className="fas fa-bell"></i> Notifications
          </a>
          <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'faq')}>
            <i className="fas fa-question-circle"></i> FAQ
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
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Dashboard')}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </a>
            {/* <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Power Consumption')}>
              <i className="fas fa-bolt"></i> Power Consumption
            </a> */}
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'User Profile')}>
              <i className="fas fa-user"></i> User Profile
            </a>
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Feedback')}>
              <i className="fas fa-comment-dots"></i> Feedback
            </a>
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Contact')}>
              <i className="fas fa-envelope"></i> Contact
            </a>
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Recent Activity')}>
              <i className="fas fa-history"></i> Active Devices
            </a>
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'Notifications')}>
              <i className="fas fa-bell"></i> Notifications
            </a>
            <a href="#" className="nav-link" onClick={(e) => handleNavLinkClick(e, 'faq')}>
            <i className="fas fa-question-circle"></i> FAQ's
          </a>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="content">
        {activeSection === 'Dashboard' && (
          <div className="row">
            {appliances.map((appliance) => (
              <div key={appliance.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <ApplianceCard appliance={appliance} onToggle={() => toggleAppliance(appliance.id, appliance.status)} />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'User Profile' && <UserProfile user={user} />}
        {activeSection === 'Feedback' && <Feedback user={user} />}
        {activeSection === 'Power Consumption' && <PowerConsumption appliances={appliances} />}
        {activeSection === 'Recent Activity' && <RecentActivity activities={recentActivity} />}
        {activeSection === 'Contact' && <ContactContent user={user} />}
        {activeSection === 'Notifications' && <Notifications user={user} />}
        {activeSection === 'faq' && <FAQ/>}
      </div>
    </div>
  );
};

export default Dashboard;
