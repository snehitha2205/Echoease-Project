// RecentActivity.js
import React from 'react';
import './recentActivity.css'; // Import the styles for the Recent Activity component

const RecentActivity = ({ activities }) => {
  return (
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <span className="activity-name">{activity.name} </span>
            {/* <span className="activity-duration">{activity.duration}s active</span> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
