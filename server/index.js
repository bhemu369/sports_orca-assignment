const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Configuration - Using football-data.org
const FOOTBALL_DATA_API_URL = 'https://api.football-data.org/v4';
const API_TOKEN = process.env.FOOTBALL_DATA_API_TOKEN;

// Competition IDs for football-data.org (prioritized by likelihood of having matches)
const COMPETITIONS = {
  'Champions League': 'CL',
  'Premier League': 'PL',
  'Serie A': 'SA',
  'La Liga': 'PD',
  'Bundesliga': 'BL1',
  'Ligue 1': 'FL1'
};

// Simple in-memory cache
const cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

// Rate limit tracking
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset every minute

function isRateLimited() {
  const now = Date.now();
  if (now > resetTime) {
    requestCount = 0;
    resetTime = now + 60000;
  }
  return requestCount >= 8; // Leave some buffer (8 instead of 10)
}

function incrementRequestCount() {
  requestCount++;
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'SportsOrca Backend API',
    version: '1.0.0',
    endpoints: {
      upcomingMatches: '/api/upcoming-matches'
    },
    dataSource: 'football-data.org',
    rateLimit: {
      remaining: Math.max(0, 8 - requestCount),
      resetIn: Math.max(0, Math.ceil((resetTime - Date.now()) / 1000))
    }
  });
});

// Get upcoming matches with smart caching and rate limiting
app.get('/api/upcoming-matches', async (req, res) => {
  try {
    console.log('Fetching upcoming matches from football-data.org...');
    
    // Check cache first
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl) {
      console.log('Returning cached data');
      return res.json({
        ...cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000)
      });
    }

    // Check rate limit
    if (isRateLimited()) {
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
      console.log(`Rate limited. Wait ${waitTime} seconds.`);
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: 'API rate limit reached (8 requests per minute). Please wait a moment and try again.',
        rateLimitInfo: {
          limit: '8 requests per minute (with buffer)',
          suggestion: `Please wait ${waitTime} seconds before refreshing`,
          apiMessage: `You can try again in ${waitTime} seconds.`
        },
        data: {
          events: [],
          count: 0,
          source: 'football-data.org'
        }
      });
    }
    
    const allMatches = [];
    let rateLimitExceeded = false;
    let rateLimitMessage = '';
    let checkedCompetitions = [];
    
    // Check competitions one by one with smart prioritization
    const competitionEntries = Object.entries(COMPETITIONS);
    
    for (const [leagueName, competitionCode] of competitionEntries.slice(0, 5)) { // Check top 5 competitions
      if (isRateLimited()) {
        console.log('Stopping due to rate limit prevention');
        break;
      }

      try {
        console.log(`Checking ${leagueName} (${competitionCode})...`);
        incrementRequestCount();
        
        const response = await axios.get(
          `${FOOTBALL_DATA_API_URL}/competitions/${competitionCode}/matches?status=SCHEDULED`,
          {
            headers: {
              'X-Auth-Token': API_TOKEN
            },
            timeout: 5000
          }
        );

        const matches = response.data.matches || [];
        console.log(`Found ${matches.length} matches in ${leagueName}`);
        checkedCompetitions.push(leagueName);
        
        // Transform matches to our format
        const transformedMatches = matches.map(match => ({
          idEvent: match.id.toString(),
          strEvent: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          strHomeTeam: match.homeTeam.name,
          strAwayTeam: match.awayTeam.name,
          dateEvent: match.utcDate.split('T')[0],
          strTime: match.utcDate.split('T')[1].replace('Z', ''),
          idHomeTeam: match.homeTeam.id.toString(),
          idAwayTeam: match.awayTeam.id.toString(),
          strHomeTeamBadge: match.homeTeam.crest,
          strAwayTeamBadge: match.awayTeam.crest,
          strLeague: response.data.competition.name,
          strStatus: match.status,
          strStage: match.stage || 'Regular Season',
          matchday: match.matchday
        }));
        
        allMatches.push(...transformedMatches);
        
        // Continue checking other competitions to gather more matches
        // Only stop early if we have many matches (10+) to avoid too much data
        if (allMatches.length >= 10) {
          console.log(`Found ${allMatches.length} matches, stopping search to avoid too much data`);
          break;
        }
        
      } catch (competitionError) {
        // Check if it's a rate limit error
        if (competitionError.response && competitionError.response.status === 429) {
          console.log(`Rate limit exceeded for ${leagueName}`);
          rateLimitExceeded = true;
          rateLimitMessage = competitionError.response.data.message || 'Rate limit exceeded';
          break; // Stop trying other competitions
        } else {
          console.log(`Error fetching ${leagueName}:`, competitionError.message);
          // Continue with other competitions for other types of errors
        }
      }
      
      // Small delay between requests to be more API-friendly
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Total upcoming matches found: ${allMatches.length}`);
    console.log(`Checked competitions: ${checkedCompetitions.join(', ')}`);
    
    // Sort matches by date
    allMatches.sort((a, b) => new Date(a.dateEvent + 'T' + a.strTime) - new Date(b.dateEvent + 'T' + b.strTime));
    
    const responseData = {
      success: true,
      data: {
        events: allMatches,
        count: allMatches.length,
        leagues: checkedCompetitions,
        source: 'football-data.org',
        note: allMatches.length === 0 ? 'No upcoming matches found in checked competitions' : null,
        rateLimitWarning: rateLimitExceeded ? 'Some competitions could not be checked due to rate limiting' : null,
        requestsRemaining: Math.max(0, 8 - requestCount)
      }
    };

    // Cache the successful response
    cache.data = responseData;
    cache.timestamp = Date.now();
    
    // If rate limit was exceeded and no matches found, return error
    if (rateLimitExceeded && allMatches.length === 0) {
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: 'API rate limit reached (8 requests per minute). Please wait a moment and try again.',
        rateLimitInfo: {
          limit: '8 requests per minute (with buffer)',
          suggestion: `Please wait ${waitTime} seconds before refreshing`,
          apiMessage: rateLimitMessage
        },
        data: {
          events: [],
          count: 0,
          source: 'football-data.org'
        }
      });
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    
    // Check if it's a rate limit error
    if (error.response && error.response.status === 429) {
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        error: 'Rate Limit Exceeded',
        message: 'API rate limit reached (8 requests per minute). Please wait a moment and try again.',
        rateLimitInfo: {
          limit: '8 requests per minute (with buffer)',
          suggestion: `Please wait ${waitTime} seconds before refreshing`,
          apiMessage: error.response.data.message || 'Rate limit exceeded'
        },
        data: {
          events: [],
          count: 0,
          source: 'football-data.org'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming matches',
      message: error.message,
      source: 'football-data.org'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dataSource: 'football-data.org',
    cache: {
      hasData: !!cache.data,
      age: cache.timestamp ? Math.floor((Date.now() - cache.timestamp) / 1000) : null
    },
    rateLimit: {
      remaining: Math.max(0, 8 - requestCount),
      resetIn: Math.max(0, Math.ceil((resetTime - Date.now()) / 1000))
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/upcoming-matches',
      'GET /health'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Upcoming matches: http://localhost:${PORT}/api/upcoming-matches`);
  console.log(`Data source: football-data.org`);
}); 