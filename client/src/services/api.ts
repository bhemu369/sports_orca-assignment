import axios from 'axios';
import type { MatchResponse } from '../types/Match';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const matchApi = {
  getMatches: async (): Promise<MatchResponse> => {
    const response = await axios.get(`${API_BASE_URL}/matches`);
    return response.data;
  }
}; 