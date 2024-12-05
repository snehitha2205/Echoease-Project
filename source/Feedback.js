import React, { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = ({ user }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!rating || !feedback) {
      alert("Please fill out both the rating and feedback fields");
      return;
    }

    const username = user.username;  // For testing purposes, you can hard-code this or collect it from user input

    // Log the data you're sending
    console.log("Sending data:", { rating, feedback, username });
    setLoading(true); // Show loading state

    try {
      await axios.post('http://localhost:3003/api/feedback', { rating, feedback, username });
      setMessage("Feedback submitted successfully!");
      setFeedback('');
      setRating(0);
    } catch (error) {
      console.error("Failed to submit feedback", error);
      setMessage("An error occurred while submitting feedback.");
    } finally {
      setLoading(false); // Hide loading state after submission
    }
  };

  const handleClear = () => {
    setFeedback('');
    setRating(0);
  };

  return (
    <div className="feedback-container">
      <h2 className='feedback'>Feedback</h2>
      <div className="rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} onClick={() => setRating(star)}>
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
      <p>Rating: {rating}/5</p> {/* Display numeric rating */}
      <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Your feedback"></textarea>
      {loading && <div className="loading-spinner">Submitting...</div>} {/* Show loading spinner */}
      <div className="button-container">
        <button className="submit-button" onClick={handleSubmit} disabled={loading}>Submit</button>
        <button className="clear-button" onClick={handleClear}>Clear</button> {/* Clear button */}
      </div>
      {message && <p className="message">{message}</p>} {/* Display success or error message */}
      

    </div>
  );
};

export default Feedback;
