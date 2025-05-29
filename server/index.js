const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API URL
const API_URL = 'https://www.thesportsdb.com/api/v1/json/123';

// Simple cache
let cachedData = null;
let cacheTime = null;

// Helper to get today's date
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Main route
app.get('/', (req, res) => {
  res.json({
    message: 'SportsOrca API',
    endpoints: {
      matches: '/api/matches'
    }
  });
});

// Get football matches
app.get('/api/matches', async (req, res) => {
  try {
    // Check cache (5 minutes)
    if (cachedData && cacheTime && (Date.now() - cacheTime) < 300000) {
      return res.json(cachedData);
    }

    // Get today's matches
    const today = getTodayDate();
    const response = await axios.get(`${API_URL}/eventsday.php?d=${today}&s=Soccer`);
    
    let matches = [];
    if (response.data && response.data.events) {
      matches = response.data.events.map(event => ({
        id: event.idEvent,
        name: event.strEvent,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        date: event.dateEvent,
        time: event.strTime,
        league: event.strLeague,
        homeBadge: event.strHomeTeamBadge,
        awayBadge: event.strAwayTeamBadge
      }));
    }

    const result = {
      success: true,
      matches: matches,
      count: matches.length
    };

    // Cache result
    cachedData = result;
    cacheTime = Date.now();

    res.json(result);
    
  } catch (error) {
    res.json({
      success: false,
      matches: [],
      count: 0,
      error: 'Failed to fetch matches'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/matches`);
}); 