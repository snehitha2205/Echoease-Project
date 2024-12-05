import React, { useState } from 'react';
import './ContactContent.css';

const ContactContent = ({ user }) => {  // Access user prop to get username
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user.username; // Assuming user prop contains the username

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch('http://localhost:3003/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, email, message }), // Include username in the request body
      });
  
      const result = await response.text(); // Use text() instead of json() to log the raw response
      console.log(result); // This will show if you are getting HTML or JSON
      
      if (response.ok) {
        setSuccess('Your message has been sent!');
      } else {
        setError(result || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error submitting your message.');
    } finally {
      setLoading(false);
    }
  
    // Reset form after submission
    setName('');
    setEmail('');
    setMessage('');
  };
  
  return (
    <div className="contact-content">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Your Username"
            value={username} // Display username from prop
            readOnly // Make it read-only as it is passed in from the parent
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            rows="3"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </div>
  );
};

export default ContactContent;
