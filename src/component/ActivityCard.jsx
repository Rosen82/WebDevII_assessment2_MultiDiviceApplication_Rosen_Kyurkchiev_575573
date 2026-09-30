import React from 'react';

export default function ActivityCard({ activity, onSelect }) {
  return (
    <div className="activity-card">
      <img src={activity.image} alt={activity.title} className="card-img" />
      <div className="card-content">
        <div className="card-header-row">
          <span className="badge">{activity.targetAudience}</span>
          <span className={`spots-badge ${activity.capacity === 0 ? 'sold-out' : ''}`}>
            {activity.capacity > 0 ? `${activity.capacity} places left` : 'Fully Booked'}
          </span>
        </div>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <button 
          className="book-btn" 
          onClick={() => onSelect(activity)}
          disabled={activity.capacity === 0}
        >
          {activity.capacity > 0 ? 'View Dates & Book' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}