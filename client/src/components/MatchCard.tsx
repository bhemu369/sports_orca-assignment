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

  const { date, time } = formatDateTime(match.date, match.time);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* League Badge */}
      {match.league && (
        <div className="text-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {match.league}
          </span>
        </div>
      )}

      {/* Match Teams */}
      <div className="space-y-4 mb-6">
        {/* Home Team */}
        <div className="flex items-center space-x-3">
          {match.homeBadge && (
            <img
              src={match.homeBadge}
              alt={`${match.homeTeam} badge`}
              className="w-12 h-12 object-contain flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="font-semibold text-gray-800 text-lg leading-tight">
            {match.homeTeam}
          </span>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 px-4 py-2 rounded-full">
            <span className="text-gray-600 font-bold text-sm">VS</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center space-x-3">
          {match.awayBadge && (
            <img
              src={match.awayBadge}
              alt={`${match.awayTeam} badge`}
              className="w-12 h-12 object-contain flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="font-semibold text-gray-800 text-lg leading-tight">
            {match.awayTeam}
          </span>
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