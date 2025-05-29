import axios from 'axios';
import type { MatchResponse } from '../types/Match';

// API Configuration - Using backend server
const API_BASE_URL = 'http://localhost:4000/api';

export const matchApi = {
  getUpcomingMatches: async (): Promise<MatchResponse> => {
    const response = await axios.get(`${API_BASE_URL}/upcoming-matches`);
    return response.data.data; // Backend wraps data in 'data' property
  },
  
  // Direct API call (commented out - now using backend)
  // getUpcomingMatches: async (): Promise<MatchResponse> => {
  //   const response = await axios.get(
  //     `${API_BASE_URL}/eventsnextleague.php?id=${EPL_LEAGUE_ID}`
  //   );
  //   return response.data;
  // },
}; 