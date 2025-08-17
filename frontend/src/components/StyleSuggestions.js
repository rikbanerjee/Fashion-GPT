import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Briefcase, 
  Building, 
  Coffee, 
  Users, 
  Heart,
  UserCheck,
  Users2,
  ShoppingBag,
  Music,
  Star
} from 'lucide-react';

const StyleSuggestions = ({ styleData }) => {
  // Icon mapping
  const iconMap = {
    briefcase: Briefcase,
    'user-check': UserCheck,
    building: Building,
    handshake: Users2,
    coffee: Coffee,
    'shopping-bag': ShoppingBag,
    users: Users,
    music: Music,
    heart: Heart,
    star: Star
  };

  // Category configuration
  const categories = {
    formal: {
      name: 'Formal',
      icon: Briefcase,
      color: '#1e40af', // Blue
      bgColor: '#dbeafe',
      borderColor: '#3b82f6',
      description: 'Professional and polished looks'
    },
    businessCasual: {
      name: 'Business Casual',
      icon: Building,
      color: '#059669', // Green
      bgColor: '#d1fae5',
      borderColor: '#10b981',
      description: 'Smart yet comfortable for work'
    },
    casual: {
      name: 'Casual',
      icon: Coffee,
      color: '#d97706', // Orange
      bgColor: '#fed7aa',
      borderColor: '#f59e0b',
      description: 'Relaxed and comfortable styles'
    },
    weekendNight: {
      name: 'Weekend Night',
      icon: Users,
      color: '#7c3aed', // Purple
      bgColor: '#e9d5ff',
      borderColor: '#8b5cf6',
      description: 'Fun and social occasions'
    },
    dateNight: {
      name: 'Date Night',
      icon: Heart,
      color: '#dc2626', // Red
      bgColor: '#fecaca',
      borderColor: '#ef4444',
      description: 'Romantic and special moments'
    }
  };

  // Handle both new structured format and legacy array format
  const isStructured = styleData && typeof styleData === 'object' && !Array.isArray(styleData);
  
  if (!isStructured) {
    // Legacy format - display as simple list
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-300" />
          <h3 className="text-xl font-semibold text-gray-800">Style Suggestions</h3>
        </div>
        <div className="space-y-3">
          {Array.isArray(styleData) ? styleData.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-indigo-600 mt-1 text-lg">•</span>
              <span className="text-gray-700 leading-relaxed">{suggestion}</span>
            </div>
          )) : (
            <p className="text-gray-700">Style suggestions not available</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-300" />
        <h3 className="text-xl font-semibold text-gray-800">Style Suggestions</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([categoryKey, categoryConfig]) => {
          const suggestions = styleData[categoryKey];
          if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
            return null;
          }

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * Object.keys(categories).indexOf(categoryKey) }}
              className="space-y-3"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: categoryConfig.bgColor,
                    color: categoryConfig.color
                  }}
                >
                  {React.createElement(categoryConfig.icon, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{categoryConfig.name}</h4>
                  <p className="text-sm text-gray-600">{categoryConfig.description}</p>
                </div>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion, index) => {
                  const IconComponent = iconMap[suggestion.icon] || Lightbulb;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
                      style={{
                        borderColor: categoryConfig.borderColor,
                        backgroundColor: categoryConfig.bgColor + '20'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className="p-2 rounded-full mt-1"
                          style={{
                            backgroundColor: categoryConfig.bgColor,
                            color: categoryConfig.color
                          }}
                        >
                          {IconComponent && React.createElement(IconComponent, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">{suggestion.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StyleSuggestions;
