import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeZoneInfo {
  city: string;
  timezone: string;
  time: string;
  status: 'available' | 'busy' | 'sleeping';
}

const TimeZoneDisplay: React.FC = () => {
  const [timezones, setTimezones] = useState<TimeZoneInfo[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('');

  const timeZoneData = [
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' }
  ];

  const getWorkingStatus = (hour: number): 'available' | 'busy' | 'sleeping' => {
    if (hour >= 9 && hour <= 17) return 'available';
    if (hour >= 18 && hour <= 22) return 'busy';
    return 'sleeping';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'sleeping': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '🟢';
      case 'busy': return '🟡';
      case 'sleeping': return '🌙';
      default: return '⚫';
    }
  };

  const updateTimes = () => {
    const now = new Date();
    const updatedTimezones = timeZoneData.map(tz => {
      try {
        const time = new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timezone,
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(now);

        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
          timeZone: tz.timezone,
          hour: '2-digit',
          hour12: false
        }).format(now));

        const status = getWorkingStatus(hour);

        return {
          city: tz.city,
          timezone: tz.timezone,
          time,
          status
        };
      } catch (error) {
        return {
          city: tz.city,
          timezone: tz.timezone,
          time: 'N/A',
          status: 'sleeping' as const
        };
      }
    });

    setTimezones(updatedTimezones);

    // Set current availability status (assuming Oscar is in Sydney timezone)
    const sydneyTz = updatedTimezones.find(tz => tz.city === 'Sydney');
    if (sydneyTz) {
      setCurrentStatus(`Currently ${sydneyTz.status} in Sydney (${sydneyTz.time})`);
    }
  };

  useEffect(() => {
    updateTimes();
    
    // Update every second for live clock
    const interval = setInterval(updateTimes, 1000);
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black rounded-lg p-6 border border-[#30C55A] hover:shadow-[0_0_20px_rgba(48,197,90,0.3)] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#30C55A] flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          Live Timezone Status
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#30C55A] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#30C55A]">Live</span>
        </div>
      </div>

      {/* Current Availability Status */}
      <div className="mb-6 p-4 bg-gray-900/50 border border-[#30C55A]/30 rounded-lg">
        <h4 className="font-semibold text-[#30C55A] mb-2">
          Current Availability
        </h4>
        <p className="text-white">
          {currentStatus}
        </p>
      </div>

      {/* Timezone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timezones.map((tz, index) => (
          <motion.div
            key={tz.city}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 border border-[#30C55A]/30 p-4 rounded-lg hover:shadow-[0_0_15px_rgba(48,197,90,0.2)] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-[#30C55A]">
                {tz.city}
              </h5>
              <span className="text-lg">
                {getStatusIcon(tz.status)}
              </span>
            </div>
            
            <div className="text-2xl font-mono text-white mb-2">
              {tz.time}
            </div>
            
            <div className={`text-sm font-medium ${getStatusColor(tz.status)}`}>
              {tz.status.charAt(0).toUpperCase() + tz.status.slice(1)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-[#30C55A]">
        💡 Best times to reach me: 9 AM - 5 PM AEST (Sydney time)
      </div>
    </motion.div>
  );
};

export default TimeZoneDisplay;