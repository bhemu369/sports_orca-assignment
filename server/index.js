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

// Helper to get upcoming dates
function getUpcomingDates(days = 7) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
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

// Get upcoming football matches
app.get('/api/matches', async (req, res) => {
  try {
    // Check cache (5 minutes)
    if (cachedData && cacheTime && (Date.now() - cacheTime) < 300000) {
      return res.json(cachedData);
    }

    const allMatches = [];
    const upcomingDates = getUpcomingDates(7); // Next 7 days

    // Get matches for next 7 days
    for (const date of upcomingDates) {
      try {
        const response = await axios.get(`${API_URL}/eventsday.php?d=${date}&s=Soccer`);
        
        if (response.data && response.data.events) {
          const dayMatches = response.data.events.map(event => ({
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
          allMatches.push(...dayMatches);
        }
      } catch (dateError) {
        console.log(`Error fetching matches for ${date}:`, dateError.message);
      }
    }

    // Remove duplicates and sort by date/time
    const uniqueMatches = allMatches.filter((match, index, self) => 
      index === self.findIndex(m => m.id === match.id)
    );

    uniqueMatches.sort((a, b) => {
      const dateTimeA = new Date(a.date + 'T' + (a.time || '00:00:00'));
      const dateTimeB = new Date(b.date + 'T' + (b.time || '00:00:00'));
      return dateTimeA - dateTimeB;
    });

    const result = {
      success: true,
      matches: uniqueMatches,
      count: uniqueMatches.length
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