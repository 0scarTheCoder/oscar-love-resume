import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// Everything in this panel is real, public GitHub data. If a source cannot be
// reached the panel says so; it never falls back to placeholder numbers.
//
// Contribution counts come from GitHub's contribution calendar. Work in
// private repositories only ever appears there as a daily count, never with a
// repository or project name, and only if "Include private contributions on
// my profile" is switched on in GitHub's profile settings of the account that
// made the commits. Nothing on the page names an employer
// or project for those counts.

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface RecentRepository {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
}

const username = '0scarTheCoder';
const profileUrl = `https://github.com/${username}`;
// Oscar's work account. Its repositories are confidential, so only its daily
// contribution counts are ever read or shown, under the label below. Never
// list, link or name its repositories here.
const workUsername = 'OscarEntech';
const workLabel = 'Entech Internal';
// GitHub does not offer the contribution calendar over a browser-readable
// API, so this open-source proxy of the public calendar is used instead.
const contributionsUrlFor = (user: string) => `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;
const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`;

// Valid days up to today from a calendar response, or null if the response is unusable.
const readCalendar = (result: PromiseSettledResult<any>): ContributionDay[] | null => {
  if (result.status !== 'fulfilled' || !Array.isArray(result.value?.contributions)) return null;
  const today = new Date().toISOString().slice(0, 10);
  return result.value.contributions.filter(
    (day: any) => day && typeof day.date === 'string' && typeof day.count === 'number' && day.date <= today
  );
};

const levelFor = (count: number) => (count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4);
const sum = (calendar: ContributionDay[]) => calendar.reduce((total, day) => total + day.count, 0);

const levelColours = ['bg-gray-800', 'bg-[#30C55A]/30', 'bg-[#30C55A]/50', 'bg-[#30C55A]/75', 'bg-[#30C55A]'];

const formatTimeAgo = (dateString: string) => {
  const diffInMinutes = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60)));
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  const days = Math.floor(diffInMinutes / 1440);
  if (days < 60) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const GitHubActivity: React.FC = () => {
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [yearTotal, setYearTotal] = useState<number | null>(null);
  const [split, setSplit] = useState<{ personal: number | null; work: number | null }>({ personal: null, work: null });
  const [repos, setRepos] = useState<RecentRepository[] | null>(null);
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchGitHubActivity = useCallback(async () => {
    const [contributions, workContributions, repositories] = await Promise.allSettled([
      fetch(contributionsUrlFor(username)).then((res) => (res.ok ? res.json() : Promise.reject(res.status))),
      fetch(contributionsUrlFor(workUsername)).then((res) => (res.ok ? res.json() : Promise.reject(res.status))),
      fetch(reposUrl).then((res) => (res.ok ? res.json() : Promise.reject(res.status))),
    ]);

    let anySucceeded = false;
    try {
      const personal = readCalendar(contributions);
      const work = readCalendar(workContributions);
      if (personal || work) {
        // Add the two accounts together day by day.
        const byDate = new Map<string, number>();
        [...(personal || []), ...(work || [])].forEach((day) => byDate.set(day.date, (byDate.get(day.date) || 0) + day.count));
        const all: ContributionDay[] = Array.from(byDate.entries())
          .sort(([first], [second]) => first.localeCompare(second))
          .map(([date, count]) => ({ date, count, level: levelFor(count) }));
        setDays(all.slice(-30));
        setYearTotal(sum(all));
        setSplit({ personal: personal ? sum(personal) : null, work: work ? sum(work) : null });
        anySucceeded = true;
      }

      if (repositories.status === 'fulfilled' && Array.isArray(repositories.value)) {
        const own = repositories.value.filter(
          (repo: any) => repo && typeof repo.name === 'string' && typeof repo.html_url === 'string' && !repo.fork && !repo.private
        );
        setRepoCount(own.length);
        setRepos(
          own.slice(0, 4).map((repo: any) => ({
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            language: repo.language,
            pushed_at: repo.pushed_at,
          }))
        );
        anySucceeded = true;
      }
    } catch (error) {
      console.error('Error reading GitHub data:', error);
    } finally {
      setFailed(!anySucceeded);
      if (anySucceeded) setLastUpdated(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubActivity();
    const interval = setInterval(fetchGitHubActivity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchGitHubActivity]);

  const show = (value: number | null) => (loading ? '…' : value === null ? 'n/a' : value);
  const monthTotal = days ? days.reduce((sum, day) => sum + day.count, 0) : null;
  const activeDays = days ? days.filter((day) => day.count > 0).length : null;

  const stats = [
    { label: 'Contributions, last 30 days', value: show(monthTotal) },
    { label: 'Active days, last 30 days', value: show(activeDays) },
    { label: 'Contributions, last 12 months', value: show(yearTotal) },
    { label: 'Public repositories', value: show(repoCount) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black rounded-lg p-6 border border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h3 className="text-xl font-bold text-[#30C55A] flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Live GitHub Activity
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#30C55A] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#30C55A]">
            {failed ? 'GitHub unavailable' : `Live • Updated ${formatTimeAgo(lastUpdated.toISOString())}`}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className="bg-[#30C55A]/10 border border-[#30C55A]/20 p-4 rounded-lg text-center"
          >
            <div className="text-2xl font-bold text-[#30C55A]">{stat.value}</div>
            <div className="text-sm text-white">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily activity, last 30 days */}
      <div>
        <h4 className="text-lg font-semibold text-[#30C55A] mb-4">Daily Activity (Last 30 Days)</h4>
        {loading ? (
          <div className="animate-pulse h-6 bg-gray-800 rounded"></div>
        ) : days ? (
          <div className="flex gap-1" role="img" aria-label={`${monthTotal} contributions on ${activeDays} of the last 30 days`}>
            {days.map((day) => (
              <div
                key={day.date}
                title={`${day.count} on ${day.date}`}
                className={`h-6 flex-1 rounded-sm ${levelColours[Math.min(day.level, 4)]}`}
              ></div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Contribution data is not available right now.{' '}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#30C55A] hover:underline">
              View the profile on GitHub
            </a>
            .
          </p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          Last 12 months: {show(split.personal)} personal, {show(split.work)} {workLabel}. Counts combine the public
          contribution calendars of Oscar's personal and work GitHub accounts. Work in private repositories appears
          only as a daily count, never by name.
        </p>
      </div>

      {/* Recently pushed public repositories */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold text-[#30C55A] mb-4 flex items-center gap-2">
          <span className="text-xl">📁</span>
          Recently Pushed Public Repositories
        </h4>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-14 bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : repos && repos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="block bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 hover:border-[#30C55A] hover:shadow-[0_0_15px_rgba(48,197,90,0.2)] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-white truncate">{repo.name}</span>
                  <span className="text-xs text-[#30C55A]/70 flex-shrink-0">{formatTimeAgo(repo.pushed_at)}</span>
                </div>
                {(repo.description || repo.language) && (
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {[repo.language, repo.description].filter(Boolean).join(' • ')}
                  </p>
                )}
              </motion.a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {repos ? 'No public repositories yet.' : 'GitHub is not responding right now.'}{' '}
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#30C55A] hover:underline">
              View the profile on GitHub
            </a>
            .
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GitHubActivity;
