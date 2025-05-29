export interface Match {
  id: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  league: string;
  homeBadge?: string;
  awayBadge?: string;
}

export interface MatchResponse {
  success: boolean;
  matches: Match[];
  count: number;
} 