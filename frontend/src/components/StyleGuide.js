import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Briefcase, 
  Building, 
  Coffee, 
  Heart, 
  Star,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';

const StyleGuide = ({ seasonalFit, suggestionsByOccasion }) => {
  if (!seasonalFit && !suggestionsByOccasion) {
    return null;
  }

  const getSeasonIcon = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '☀️';
      case 'fall':
      case 'autumn':
        return '🍂';
      case 'winter':
        return '❄️';
      default:
        return '📅';
    }
  };

  const getOccasionIcon = (occasion) => {
    switch (occasion?.toLowerCase()) {
      case 'formal':
        return Briefcase;
      case 'business':
        return Building;
      case 'casual':
        return Coffee;
      default:
        return Star;
    }
  };

  const getOccasionColor = (occasion) => {
    switch (occasion?.toLowerCase()) {
      case 'formal':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'business':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'casual':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Seasonal Fit Section */}
      {seasonalFit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Seasonal Fit</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Seasons */}
            {seasonalFit.bestSeasons && seasonalFit.bestSeasons.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Best Seasons
                </h4>
                <div className="flex flex-wrap gap-2">
                  {seasonalFit.bestSeasons.map((season, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-full border border-green-300"
                    >
                      <span className="text-lg">{getSeasonIcon(season)}</span>
                      <span className="font-medium capitalize">{season}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Avoid Seasons */}
            {seasonalFit.avoidSeasons && seasonalFit.avoidSeasons.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  Avoid Seasons
                </h4>
                <div className="flex flex-wrap gap-2">
                  {seasonalFit.avoidSeasons.map((season, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-full border border-red-300"
                    >
                      <span className="text-lg">{getSeasonIcon(season)}</span>
                      <span className="font-medium capitalize">{season}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rationale */}
          {seasonalFit.rationale && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Why This Works</h4>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">{seasonalFit.rationale}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Occasion-Based Suggestions */}
      {suggestionsByOccasion && Object.keys(suggestionsByOccasion).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Star className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-800">Styling by Occasion</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(suggestionsByOccasion).map(([occasion, suggestion], index) => {
              const IconComponent = getOccasionIcon(occasion);
              const colorClass = getOccasionColor(occasion);
              
              return (
                <motion.div
                  key={occasion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-lg border ${colorClass}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-white/50">
                      {IconComponent && React.createElement(IconComponent, { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 capitalize">{occasion}</h4>
                      <p className="text-sm leading-relaxed">{suggestion}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StyleGuide;
