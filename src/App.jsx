import React, { useState, useEffect } from 'react';
import ActivityCard from './component/ActivityCard';
import './style.css';

/*
 * App Component - Main Single Page Application (SPA) Controller
 * Handles application state, customer authentication, activity catalog filtering,
 * asynchronous communication with the Express backend, and booking management.
 *
 * Code reference: Implemented using React Hooks (useState, useEffect) following
 * official React architectural guidelines (React, 2026; MDN Web Docs, 2026).
 */
export default function App() {
  // Activity inventory and live view state
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  // Account authentication and modal state
  const [currentUser, setCurrentUser] = useState(null); // stores active user: { name, email }
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // false = Login mode, true = Register mode
  
  // Temporary input state for auth modal
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');

  // User booking history state
  const [myBookings, setMyBookings] = useState([]);
  const [viewingMyBookings, setViewingMyBookings] = useState(false);

  // Fetch initial activity list and initial capacities from our Express server on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error("Error fetching activities from server:", err));
  }, []);

  // Handle customer login or new account registration submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authEmail) {
      // If registering use the entered full name; if logging in fallback to email prefix if name is absent
      const userName = authName || authEmail.split('@')[0];
      setCurrentUser({ name: userName, email: authEmail });
      
      // Close modal and reset fields
      setShowAuthModal(false);
      setAuthName('');
      setAuthEmail('');
    }
  };

  // Fetch all saved bookings registered under the current logged-in user's email
  const fetchMyBookings = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    fetch(`http://localhost:5000/api/bookings?email=${currentUser.email}`)
      .then(res => res.json())
      .then(data => {
        setMyBookings(data);
        setViewingMyBookings(true);
        setSelectedActivity(null); // Return to list context if viewing an individual activity
      })
      .catch(err => console.error("Error fetching user bookings:", err));
  };

  // Filter activities across title, target audience, and category for real-time search
  const filteredActivities = activities.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit booking reservation to Express server and update capacity dynamically
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // POST request to decrement backend capacity and persist user booking in memory
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activityId: selectedActivity.id,
        selectedDate,
        userName: currentUser.name,
        userEmail: currentUser.email
      })
    })
    .then(res => res.json())
    .then(data => {
      setBookingMessage(data.message);
      // Re-fetch activities immediately so the frontend reflects updated capacity spots
      fetch('http://localhost:5000/api/activities')
        .then(res => res.json())
        .then(updated => setActivities(updated));
    })
    .catch(() => setBookingMessage("Error submitting booking. Please try again."));
  };

  return (
    <div className="app-container">
      {/* Site Header with Branding and Customer Account Bar */}
      <header className="site-header">
        <h1>Community Activity Booking</h1>
        <p>Inclusive leisure activities for children, adults, elderly, and wellness.</p>
        
        {/* Dynamic Account Management Navigation */}
        <div className="account-bar">
          {currentUser ? (
            <div className="logged-in-info">
              <span>Welcome, <strong>{currentUser.name}</strong></span>
              <button onClick={fetchMyBookings} className="nav-btn">My Bookings</button>
              <button 
                onClick={() => { setCurrentUser(null); setViewingMyBookings(false); }} 
                className="nav-btn logout-btn"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="auth-trigger-group">
              <button 
                onClick={() => { setIsRegistering(false); setShowAuthModal(true); }} 
                className="nav-btn login-trigger-btn"
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsRegistering(true); setShowAuthModal(true); }} 
                className="nav-btn register-trigger-btn"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Authentication Modal: Switches between Log In and Register */}
      {showAuthModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{isRegistering ? "Create Customer Account" : "Log In to Your Account"}</h3>
            <p>
              {isRegistering 
                ? "Sign up to track your bookings and save your activity slots." 
                : "Enter your registered email to access your bookings."}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="booking-form">
              {isRegistering && (
                <>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Sarah Smith" 
                    value={authName} 
                    onChange={(e) => setAuthName(e.target.value)} 
                    required 
                  />
                </>
              )}

              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="e.g., sarah@example.com" 
                value={authEmail} 
                onChange={(e) => setAuthEmail(e.target.value)} 
                required 
              />

              <div className="modal-buttons">
                <button type="submit" className="submit-booking-btn">
                  {isRegistering ? "Register Account" : "Log In"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </button>
              </div>
            </form>

            {/* Toggle link to switch between Login and Register views */}
            <div className="auth-switch-prompt">
              {isRegistering ? (
                <p>Already have an account? <button type="button" className="link-btn" onClick={() => setIsRegistering(false)}>Log In</button></p>
              ) : (
                <p>Don't have an account? <button type="button" className="link-btn" onClick={() => setIsRegistering(true)}>Create one</button></p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 1: Customer Booking History ("My Bookings") */}
      {viewingMyBookings ? (
        <div className="booking-view">
          <h2>My Saved Bookings</h2>
          {myBookings.length === 0 ? (
            <p>You have not booked any activities yet.</p>
          ) : (
            <ul className="my-bookings-list">
              {myBookings.map(b => (
                <li key={b.id} className="booking-item">
                  <strong>{b.activityTitle}</strong>
                  <p>Date: {b.selectedDate}</p>
                  <p>Reserved for: {b.userName} ({b.userEmail})</p>
                </li>
              ))}
            </ul>
          )}
          <button className="back-btn" onClick={() => setViewingMyBookings(false)}>← Back to Activities</button>
        </div>
      ) : !selectedActivity ? (
        /* View 2: Primary Activity Catalog Feed with Search Bar */
        <main className="main-content">
          <div className="search-bar-container">
            <input 
              type="text" 
              placeholder="Search activities (e.g., Yoga, Children, Kayaking)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="activity-grid">
            {filteredActivities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onSelect={setSelectedActivity} 
              />
            ))}
          </div>
        </main>
      ) : (
        /* View 3: Activity Detail and Session Booking Form */
        <div className="booking-view">
          <button className="back-btn" onClick={() => { setSelectedActivity(null); setBookingMessage(''); }}>
            ← Back to Activities
          </button>
          
          <h2>{selectedActivity.title}</h2>
          <p>{selectedActivity.description}</p>
          
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <h3>Choose an Available Date</h3>
            <div className="date-options">
              {selectedActivity.dates.map(date => (
                <label key={date} className={`date-chip ${selectedDate === date ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="activityDate" 
                    value={date} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                  {date}
                </label>
              ))}
            </div>

            {/* Display logged-in status or prompt user to authenticate */}
            {currentUser ? (
              <div className="account-note">
                <p>Booking under account: <strong>{currentUser.name}</strong> ({currentUser.email})</p>
              </div>
            ) : (
              <div className="account-note warning">
                <p>You must <button type="button" className="link-btn" onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}>log in</button> or <button type="button" className="link-btn" onClick={() => { setIsRegistering(true); setShowAuthModal(true); }}>create an account</button> to complete this booking.</p>
              </div>
            )}

            <button type="submit" className="submit-booking-btn" disabled={!currentUser}>
              Confirm Booking
            </button>
          </form>

          {bookingMessage && <p className="success-msg">{bookingMessage}</p>}
        </div>
      )}
    </div>
  );
}