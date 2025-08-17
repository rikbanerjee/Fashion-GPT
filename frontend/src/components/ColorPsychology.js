import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  Brain, 
  Target,
  Users,
  Briefcase,
  Home
} from 'lucide-react';

const ColorPsychology = ({ psychologyData, dominantColors = [] }) => {
  // Context configuration
  const contexts = {
    work: {
      name: 'Work',
      icon: Briefcase,
      color: '#1e40af', // Blue
      bgColor: '#dbeafe',
      borderColor: '#3b82f6',
      description: 'Professional environments'
    },
    social: {
      name: 'Social',
      icon: Users,
      color: '#059669', // Green
      bgColor: '#d1fae5',
      borderColor: '#10b981',
      description: 'Social interactions'
    },
    personal: {
      name: 'Personal',
      icon: Home,
      color: '#d97706', // Orange
      bgColor: '#fed7aa',
      borderColor: '#f59e0b',
      description: 'Personal comfort'
    }
  };

  // Handle both new structured format and legacy string format
  const isStructured = psychologyData && typeof psychologyData === 'object' && !Array.isArray(psychologyData);
  
  if (!isStructured) {
    // Legacy format - display as simple text
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-6 h-6 text-pink-300" />
          <h3 className="text-xl font-semibold text-gray-800">Color Psychology</h3>
        </div>
        <div className="text-gray-700 leading-relaxed">
          {psychologyData || 'Color psychology analysis not available'}
        </div>
      </motion.div>
    );
  }

  const { 
    emotionalImpact, 
    socialPerception, 
    psychologicalEffects, 
    bestContexts = [], 
    colorMeanings = [] 
  } = psychologyData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="w-6 h-6 text-pink-300" />
        <h3 className="text-xl font-semibold text-gray-800">Color Psychology</h3>
      </div>

      <div className="space-y-6">
        {/* Psychological Aspects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Emotional Impact */}
          {emotionalImpact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg border-2 border-pink-200 bg-pink-50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-full bg-pink-100 text-pink-600">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Emotional Impact</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {emotionalImpact}
              </p>
            </motion.div>
          )}

          {/* Social Perception */}
          {socialPerception && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Social Perception</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {socialPerception}
              </p>
            </motion.div>
          )}

          {/* Psychological Effects */}
          {psychologicalEffects && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <Brain className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800">Psychological Effects</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {psychologicalEffects}
              </p>
            </motion.div>
          )}
        </div>

        {/* Best Contexts */}
        {bestContexts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Best Contexts</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {bestContexts.map((context) => {
                const contextConfig = contexts[context];
                if (!contextConfig) return null;
                
                return (
                  <motion.div
                    key={context}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: contextConfig.bgColor,
                      color: contextConfig.color,
                      border: `2px solid ${contextConfig.borderColor}`
                    }}
                  >
                    <contextConfig.icon className="w-4 h-4" />
                    <span>{contextConfig.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Color Meanings */}
        {colorMeanings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h4 className="text-lg font-semibold text-gray-800">Individual Color Meanings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {colorMeanings.map((colorMeaning, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                       style={{ backgroundColor: getColorHex(colorMeaning.color) }}></div>
                  <div>
                    <span className="font-semibold text-gray-800 capitalize">{colorMeaning.color}</span>
                    <p className="text-sm text-gray-600">{colorMeaning.meaning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Helper function to get color hex (same as in ColorAnalysis)
const getColorHex = (colorName) => {
  const colorMap = {
    'red': '#ef4444', 'blue': '#3b82f6', 'green': '#10b981', 'yellow': '#f59e0b',
    'purple': '#8b5cf6', 'pink': '#ec4899', 'black': '#111827', 'white': '#ffffff',
    'gray': '#6b7280', 'brown': '#a16207', 'navy': '#1e3a8a', 'beige': '#f5f5dc',
    'cream': '#fefce8', 'mint': '#a7f3d0', 'lavender': '#e9d5ff', 'coral': '#fb7185',
    'teal': '#14b8a6', 'maroon': '#dc2626', 'olive': '#84cc16', 'gold': '#fbbf24',
    'silver': '#cbd5e1', 'burgundy': '#991b1b', 'emerald': '#059669', 'sapphire': '#1d4ed8',
    'rose': '#fda4af', 'indigo': '#6366f1', 'cyan': '#06b6d4', 'magenta': '#d946ef',
    'lime': '#84cc16', 'orange': '#f97316'
  };
  
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#6b7280';
};

export default ColorPsychology;
