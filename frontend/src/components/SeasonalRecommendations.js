import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sun, Leaf, Snowflake } from 'lucide-react';

const SeasonalRecommendations = ({ seasonalData }) => {
  // Season configuration with icons and colors
  const seasons = {
    spring: {
      name: 'Spring',
      icon: Leaf,
      color: '#10b981', // Green
      bgColor: '#d1fae5',
      borderColor: '#34d399'
    },
    summer: {
      name: 'Summer',
      icon: Sun,
      color: '#f59e0b', // Yellow/Orange
      bgColor: '#fef3c7',
      borderColor: '#fbbf24'
    },
    fall: {
      name: 'Fall',
      icon: Leaf,
      color: '#d97706', // Orange
      bgColor: '#fed7aa',
      borderColor: '#fb923c'
    },
    winter: {
      name: 'Winter',
      icon: Snowflake,
      color: '#3b82f6', // Blue
      bgColor: '#dbeafe',
      borderColor: '#60a5fa'
    }
  };

  // Handle both new structured format and legacy string format
  const isStructured = seasonalData && typeof seasonalData === 'object' && !Array.isArray(seasonalData);
  
  if (!isStructured) {
    // Legacy format - display as simple text
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-green-300" />
          <h3 className="text-xl font-semibold text-gray-800">Seasonal Recommendations</h3>
        </div>
        <div className="text-gray-700 leading-relaxed">
          {seasonalData || 'Seasonal analysis not available'}
        </div>
      </motion.div>
    );
  }

  const { bestSeasons = [], avoidSeasons = [] } = seasonalData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-green-300" />
        <h3 className="text-xl font-semibold text-gray-800">Seasonal Recommendations</h3>
      </div>

      {/* Best Seasons Highlight */}
      {bestSeasons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">🌟 Best Seasons</h4>
          <div className="flex flex-wrap gap-2">
            {bestSeasons.map((season) => {
              const seasonConfig = seasons[season];
              if (!seasonConfig) return null;
              
              return (
                <motion.div
                  key={season}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: seasonConfig.bgColor,
                    color: seasonConfig.color,
                    border: `2px solid ${seasonConfig.borderColor}`
                  }}
                >
                  <seasonConfig.icon className="w-4 h-4" />
                  <span>{seasonConfig.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Avoid Seasons */}
      {avoidSeasons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Avoid These Seasons</h4>
          <div className="flex flex-wrap gap-2">
            {avoidSeasons.map((season) => {
              const seasonConfig = seasons[season];
              if (!seasonConfig) return null;
              
              return (
                <motion.div
                  key={season}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium opacity-60"
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: '2px solid #d1d5db'
                  }}
                >
                  <seasonConfig.icon className="w-4 h-4" />
                  <span>{seasonConfig.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(seasons).map(([seasonKey, seasonConfig]) => {
          const description = seasonalData[seasonKey];
          const isBest = bestSeasons.includes(seasonKey);
          const isAvoid = avoidSeasons.includes(seasonKey);
          
          return (
            <motion.div
              key={seasonKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * Object.keys(seasons).indexOf(seasonKey) }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isBest 
                  ? 'border-green-300 bg-green-50' 
                  : isAvoid 
                    ? 'border-gray-300 bg-gray-50 opacity-60' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: isBest ? seasonConfig.bgColor : '#f3f4f6',
                    color: isBest ? seasonConfig.color : '#6b7280'
                  }}
                >
                  <seasonConfig.icon className="w-5 h-5" />
                </div>
                <h5 className={`font-semibold ${
                  isBest ? 'text-green-800' : isAvoid ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {seasonConfig.name}
                </h5>
                {isBest && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Best
                  </span>
                )}
                {isAvoid && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Avoid
                  </span>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${
                isBest ? 'text-green-700' : isAvoid ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {description || 'No specific recommendation for this season.'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SeasonalRecommendations;
