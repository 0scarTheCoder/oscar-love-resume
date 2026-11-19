import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface EarthquakeEvent {
  id: string;
  properties: {
    mag: number;
    place: string | null;
    time: number;
    updated: number;
    tz: number | null;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
}

const EarthquakeFeed: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [failed, setFailed] = useState(false);
  const [counts, setCounts] = useState({ major: 0, strong: 0, total: 0 });

  const fetchEarthquakes = useCallback(async () => {
    try {
      // USGS Earthquake API - last 24 hours, magnitude 2.5+
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
      );
      if (!response.ok) throw new Error(`USGS responded ${response.status}`);
      const data = await response.json();
      if (!data.features || !Array.isArray(data.features)) throw new Error('Unexpected USGS response');

      // USGS fields can be null, so drop anything the list could not render.
      const all: EarthquakeEvent[] = data.features.filter(
        (f: any) =>
          f && f.properties && typeof f.properties.mag === 'number' && Array.isArray(f.geometry?.coordinates)
      );

      // Counts cover the whole feed; the list shows the ten largest.
      setCounts({
        major: all.filter((eq) => eq.properties.mag >= 6).length,
        strong: all.filter((eq) => eq.properties.mag >= 5 && eq.properties.mag < 6).length,
        total: all.length,
      });
      setEarthquakes([...all].sort((a, b) => b.properties.mag - a.properties.mag).slice(0, 10));
      setFailed(false);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      setFailed(true);
      setLoading(false);
    }
  }, []);

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7) return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    if (magnitude >= 6) return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
    if (magnitude >= 5) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
    if (magnitude >= 4) return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    return 'text-green-500 bg-green-100 dark:bg-green-900/20';
  };

  const getMagnitudeIcon = (magnitude: number) => {
    if (magnitude >= 7) return '🔴';
    if (magnitude >= 6) return '🟠';
    if (magnitude >= 5) return '🟡';
    if (magnitude >= 4) return '🔵';
    return '🟢';
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatLocation = (place: string | null) => {
    if (!place) return 'Location not reported';
    // Clean up location names (remove distance info)
    return place.replace(/^\d+km\s+[A-Z]+\s+of\s+/, '').substring(0, 30) + (place.length > 30 ? '...' : '');
  };

  useEffect(() => {
    fetchEarthquakes();
    
    // Update every 5 minutes
    const interval = setInterval(fetchEarthquakes, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchEarthquakes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black rounded-lg p-6 border border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h3 className="text-xl font-bold text-[#30C55A] flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          Live Earthquake Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#30C55A] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#30C55A]">
            {failed && earthquakes.length === 0 ? 'Feed unavailable' : `Live • Updated ${formatTimeAgo(lastUpdated.getTime())}`}
          </span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-red-500 dark:text-red-400">
            {failed && earthquakes.length === 0 ? 'n/a' : counts.major}
          </div>
          <div className="text-xs text-white">Major (6.0+)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-500 dark:text-orange-400">
            {failed && earthquakes.length === 0 ? 'n/a' : counts.strong}
          </div>
          <div className="text-xs text-white">Strong (5.0+)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
            {failed && earthquakes.length === 0 ? 'n/a' : counts.total}
          </div>
          <div className="text-xs text-white">Total (2.5+)</div>
        </div>
      </div>

      {/* Earthquake List */}
      <div>
        <h4 className="text-lg font-semibold text-[#30C55A] mb-4">Recent Activity</h4>
        
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
        ) : failed && earthquakes.length === 0 ? (
          <p className="text-sm text-gray-400">The USGS feed is not responding right now.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {earthquakes.map((earthquake, index) => (
              <motion.div
                key={earthquake.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => window.open(earthquake.properties.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="flex-shrink-0 text-lg">
                  {getMagnitudeIcon(earthquake.properties.mag)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getMagnitudeColor(earthquake.properties.mag)}`}>
                      M{earthquake.properties.mag.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatLocation(earthquake.properties.place)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Depth: {typeof earthquake.geometry.coordinates[2] === 'number' ? earthquake.geometry.coordinates[2].toFixed(1) : 'n/a '}km
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(earthquake.properties.time)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Data from USGS • Updates every 5 minutes • Click for details
        </p>
      </div>
    </motion.div>
  );
};

export default EarthquakeFeed;