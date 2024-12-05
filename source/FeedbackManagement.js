import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackManagement.css';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axios.get('http://localhost:3003/api/feedback');
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks", error);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
    } catch (error) {
      console.error("Failed to delete feedback", error);
    }
  };

  // Filter feedbacks based on the search input
  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.username.toLowerCase().includes(search.toLowerCase()) ||
    feedback.feedback.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="feedback-management-container">
      

      {/* Main Content Area */}
      <div className="main-content">
        <h2>Feedback Management</h2>

        {/* Search Input */}
        <input
          type="text"
          className="search-input"
          placeholder="Search Feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Feedback Table */}
        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Feedback</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map(feedback => (
              <tr key={feedback._id}>
                <td>{feedback.username}</td>
                <td>{feedback.feedback}</td>
                <td>{feedback.rating}</td>
                <td>{new Date(feedback.date).toLocaleDateString()}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(feedback._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackManagement;
