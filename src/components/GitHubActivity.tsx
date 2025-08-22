import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
// Removed react-icons imports - using emojis instead for better TypeScript compatibility

interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload?: any;
}

interface GitHubStats {
  totalCommits: number;
  currentStreak: number;
  totalStars: number;
  totalRepos: number;
}

const GitHubActivity: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [stats, setStats] = useState<GitHubStats>({
    totalCommits: 0,
    currentStreak: 0,
    totalStars: 0,
    totalRepos: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const username = '0scarTheCoder'; // Your GitHub username

  const fetchGitHubActivity = useCallback(async () => {
    try {
      // Fetch recent events
      const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public`);
      const eventsData = await eventsResponse.json();
      
      // Fetch user stats
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userResponse.json();
      
      // Fetch repositories for stars count
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      const reposData = await reposResponse.json();
      
      if (Array.isArray(eventsData)) {
        setEvents(eventsData.slice(0, 10)); // Show last 10 events
      }
      
      if (Array.isArray(reposData)) {
        const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
        const totalCommits = eventsData.filter((event: any) => event.type === 'PushEvent').length;
        
        setStats({
          totalCommits: totalCommits,
          currentStreak: calculateStreak(eventsData),
          totalStars: totalStars,
          totalRepos: userData.public_repos || 0
        });
      }
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setLoading(false);
    }
  }, [username]);

  const calculateStreak = (events: any[]) => {
    const commitDates = events
      .filter(event => event.type === 'PushEvent')
      .map(event => new Date(event.created_at).toDateString());
    
    const uniqueDates = Array.from(new Set(commitDates));
    return uniqueDates.length;
  };

  const formatEventType = (type: string) => {
    switch (type) {
      case 'PushEvent': return 'Pushed code';
      case 'CreateEvent': return 'Created repository';
      case 'WatchEvent': return 'Starred repository';
      case 'ForkEvent': return 'Forked repository';
      case 'IssuesEvent': return 'Created issue';
      case 'PullRequestEvent': return 'Created pull request';
      default: return type.replace('Event', '');
    }
  };

  const getEventIcon = (type: string) => {
    const config = {
      'PushEvent': { emoji: '📤', color: 'text-green-500' },
      'CreateEvent': { emoji: '🆕', color: 'text-blue-500' },
      'WatchEvent': { emoji: '⭐', color: 'text-yellow-500' },
      'ForkEvent': { emoji: '🔀', color: 'text-purple-500' }
    } as const;
    
    const eventConfig = config[type as keyof typeof config] || { emoji: '📄', color: 'text-gray-500' };
    
    return (
      <span className={`text-lg ${eventConfig.color}`}>
        {eventConfig.emoji}
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    fetchGitHubActivity();
    
    // Update every 5 minutes
    const interval = setInterval(fetchGitHubActivity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchGitHubActivity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Live GitHub Activity
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Live • Updated {formatTimeAgo(lastUpdated.toISOString())}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCommits}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Recent Commits</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.currentStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Activity Days</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.totalStars}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Stars</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center"
        >
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalRepos}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-shrink-0 text-lg">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{formatEventType(event.type)}</span>
                    {' '}in{' '}
                    <a 
                      href={`https://github.com/${event.repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {event.repo.name}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(event.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GitHubActivity;