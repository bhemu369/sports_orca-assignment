import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import MatchCard from './components/MatchCard';
import LoadingSpinner from './components/LoadingSpinner';
import { matchApi } from './services/api';
import type { Match } from './types/Match';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ 
    message: string; 
    isRateLimit: boolean; 
    rateLimitInfo?: { limit: string; suggestion: string };
    suggestion?: string;
  } | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await matchApi.getUpcomingMatches();
        setMatches(data.events || []);
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        
        // Handle rate limit errors specifically
        if (err.response?.status === 429) {
          const rateLimitData = err.response.data;
          setError({
            message: rateLimitData.message || 'Rate limit exceeded',
            isRateLimit: true,
            rateLimitInfo: rateLimitData.rateLimitInfo,
            suggestion: rateLimitData.rateLimitInfo?.suggestion || 'Please wait a moment and try again'
          });
        } else {
          setError({
            message: err.response?.data?.message || err.message || 'Failed to fetch upcoming matches',
            isRateLimit: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          {error.isRateLimit ? (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Rate Limit Reached</h2>
              <p className="text-gray-600 mb-4">{error.message}</p>
              {error.rateLimitInfo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Limit:</strong> {error.rateLimitInfo.limit}
                  </p>
                  <p className="text-sm text-yellow-800">
                    <strong>Suggestion:</strong> {error.rateLimitInfo.suggestion}
                  </p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Upcoming Soccer Matches
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            English Premier League - Upcoming Fixtures
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
        {loading && <LoadingSpinner />}

        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Upcoming Matches
            </h2>
            <p className="text-gray-500">
              There are currently no upcoming matches scheduled.
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.idEvent} match={match} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>
              Data provided by{' '}
              <a
                href="https://www.thesportsdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                TheSportsDB
              </a>
            </p>
            <p className="text-sm mt-2">
              Built for SportsOrca Full Stack Internship Task
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
