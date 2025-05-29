import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Match } from '../types/Match';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  // Format date and time
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const dateTime = new Date(`${dateStr}T${timeStr}`);
      const date = dateTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const time = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { date, time };
    } catch {
      // Fallback if time parsing fails
      const date = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return { date, time: timeStr || 'TBD' };
    }
  };

  const { date, time } = formatDateTime(match.dateEvent, match.strTime);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Match Teams */}
      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex items-center space-x-3 flex-1">
          {match.strHomeTeamBadge && (
            <img
              src={match.strHomeTeamBadge}
              alt={`${match.strHomeTeam} badge`}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="font-semibold text-gray-800 text-lg">
            {match.strHomeTeam}
          </span>
        </div>

        {/* VS */}
        <div className="mx-4">
          <span className="text-gray-500 font-bold text-xl">VS</span>
        </div>

        {/* Away Team */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <span className="font-semibold text-gray-800 text-lg">
            {match.strAwayTeam}
          </span>
          {match.strAwayTeamBadge && (
            <img
              src={match.strAwayTeamBadge}
              alt={`${match.strAwayTeam} badge`}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>

      {/* Match Date and Time */}
      <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">{date}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard; 