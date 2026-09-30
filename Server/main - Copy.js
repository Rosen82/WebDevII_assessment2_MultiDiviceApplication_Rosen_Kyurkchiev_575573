const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let activities = [
  {
    id: 1,
    title: "Community Kayaking Adventure",
    category: "outdoor",
    targetAudience: "Teens & Adults",
    description: "Guided kayaking sessions along the river for all skill levels.",
    image: "/kayaking.png",
    capacity: 10,
    dates: ["2026-10-14", "2026-10-21"]
  },
  {
    id: 2,
    title: "Family Park Bike Ride",
    category: "outdoor",
    targetAudience: "Families",
    description: "Safe group bicycle trails around the local park paths.",
    image: "/family-cycling.png",
    capacity: 10,
    dates: ["2026-10-12", "2026-10-19"]
  },
  {
    id: 3,
    title: "Kids Play & Parachute Fun",
    category: "children",
    targetAudience: "Children (Ages 5-10)",
    description: "Active games and energetic group play outdoors.",
    image: "/kids-parachute.png",
    capacity: 10,
    dates: ["2026-10-11", "2026-10-18"]
  },
  {
    id: 4,
    title: "All-Ages Community Sports",
    category: "community",
    targetAudience: "All Ages",
    description: "Inclusive outdoor sports and exercises for the whole community.",
    image: "/inclusive-community.png",
    capacity: 10,
    dates: ["2026-10-13", "2026-10-20"]
  },
  {
    id: 5,
    title: "Core & Mobility Workout",
    category: "fitness",
    targetAudience: "Adults",
    description: "Strengthen your core and improve flexibility with professional guidance.",
    image: "/core-fitness.png",
    capacity: 10,
    dates: ["2026-10-10", "2026-10-17"]
  },
  {
    id: 6,
    title: "Gentle Morning Yoga & Stretching",
    category: "yoga",
    targetAudience: "Elderly Friendly / All Ages",
    description: "A calm stretching session designed for mobility and relaxation.",
    image: "/elderly-yoga.png",
    capacity: 10,
    dates: ["2026-10-15", "2026-10-22"]
  },
  {
    id: 7,
    title: "Scenic Riverside Running Club",
    category: "fitness",
    targetAudience: "Teens & Adults",
    description: "A friendly group running session along the scenic waterfront trail.",
    image: "/outdoor-running.png",
    capacity: 10,
    dates: ["2026-10-16", "2026-10-23"]
  },
  {
    id: 8,
    title: "Indoor Rock Climbing Session",
    category: "adventure",
    targetAudience: "Ages 12+",
    description: "Challenge yourself with supervised indoor rock climbing walls.",
    image: "/rock-climbing.png",
    capacity: 10,
    dates: ["2026-10-18", "2026-10-25"]
  }
];

// In-memory database array for user bookings
let userBookings = [];

// GET endpoint to fetch activities
app.get('/api/activities', (req, res) => {
  res.json(activities);
});

// GET endpoint to fetch bookings for a specific user email
app.get('/api/bookings', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email query parameter is required." });
  }
  const filteredBookings = userBookings.filter(b => b.userEmail === email);
  res.json(filteredBookings);
});

// POST endpoint to handle booking requests
app.post('/api/bookings', (req, res) => {
  const { activityId, selectedDate, userName, userEmail } = req.body;
  
  const activity = activities.find(a => a.id === parseInt(activityId));

  if (!activity) {
    return res.status(404).json({ success: false, message: "Activity not found." });
  }

  if (activity.capacity <= 0) {
    return res.status(400).json({ success: false, message: "Sorry, this activity is fully booked!" });
  }

  if (!userName || !userEmail || !selectedDate) {
    return res.status(400).json({ success: false, message: "Missing required booking details." });
  }

  // Reduce capacity by 1
  activity.capacity -= 1;

  // Save the booking
  const newBooking = {
    id: Date.now(),
    activityId: activity.id,
    activityTitle: activity.title,
    selectedDate,
    userName,
    userEmail
  };
  userBookings.push(newBooking);

  res.status(201).json({ success: true, message: `Booking confirmed successfully! Places left: ${activity.capacity}` });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));