import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Building, 
  Coffee, 
  Star,
  Circle
} from 'lucide-react';

const EnhancedStyleSuggestions = ({ suggestionsByOccasion }) => {
  if (!suggestionsByOccasion || Object.keys(suggestionsByOccasion).length === 0) {
    return null;
  }

  // Icon mapping for different clothing and accessory types
  const iconMap = {
    // Clothing
    blazer: Briefcase,
    dress: Star, // Using Star icon for dress
    shirt: Star, // Using Star icon for shirt
    pants: Star, // Using Star icon for pants
    skirt: Star, // Using Star icon for skirt
    sweater: Star, // Using Star icon for sweater
    jacket: Briefcase, // Using briefcase icon for jacket (similar to blazer)
    blouse: Star, // Using Star icon for blouse
    trousers: Star, // Using Star icon for trousers
    cardigan: Star, // Using Star icon for cardigan
    
    // Accessories
    watch: Circle, // Using Circle icon for watch
    necklace: Circle, // Using Circle icon for necklace
    belt: Star, // Using Star icon for belt
    tie: Star, // Using Star icon for tie
    scarf: Star, // Using Star icon for scarf
    handbag: Briefcase, // Using Briefcase icon for handbag (similar bag accessory)
    shoes: Circle, // Using Circle icon for shoes
    cufflinks: Circle, // Using Circle icon for cufflinks
    bracelet: Circle, // Using Circle icon for bracelet
    earrings: Circle, // Using Circle icon for earrings
  };

  // Color mapping for visual representation
  const colorMap = {
    navy: '#1e3a8a',
    beige: '#f5f5dc',
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    darkgray: '#374151',
    brown: '#a16207',
    silver: '#cbd5e1',
    gold: '#fbbf24',
    burgundy: '#991b1b',
    cream: '#fefce8',
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#10b981',
    purple: '#8b5cf6',
    pink: '#ec4899',
    yellow: '#f59e0b',
    orange: '#f97316',
    teal: '#14b8a6',
    indigo: '#6366f1',
  };

  const getIconComponent = (iconName) => {
    // Extract the base item name (remove color prefix)
    const itemName = iconName.split(' ').pop().toLowerCase();
    return iconMap[itemName] || Star;
  };

  const getIconColor = (iconName) => {
    // Extract color from icon name (e.g., "navy blazer" -> "navy")
    const colorName = iconName.split(' ')[0].toLowerCase();
    return colorMap[colorName] || '#6b7280'; // Default gray if color not found
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
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
          
          // Handle both new format (object with text and visuals) and legacy format (string)
          const suggestionText = typeof suggestion === 'object' ? suggestion.text : suggestion;
          const visuals = typeof suggestion === 'object' ? suggestion.visuals : [];
          
          return (
            <motion.div
              key={occasion}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`p-5 rounded-lg border ${colorClass}`}
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="p-2 rounded-full bg-white/50">
                  {IconComponent && React.createElement(IconComponent, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 capitalize">{occasion}</h4>
                  <p className="text-sm leading-relaxed">{suggestionText}</p>
                </div>
              </div>

              {/* Visual Icons */}
              {visuals && visuals.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Suggested Items:</h5>
                  <div className="flex flex-wrap gap-3">
                    {visuals.map((visual, visualIndex) => {
                      const VisualIcon = getIconComponent(visual);
                      const iconColor = getIconColor(visual);
                      
                      return (
                        <motion.div
                          key={visualIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * visualIndex }}
                          className="flex flex-col items-center space-y-2 p-3 bg-white/50 rounded-lg border border-gray-200"
                        >
                          <div
                            className="p-3 rounded-full"
                            style={{ backgroundColor: iconColor + '20' }}
                          >
                            <VisualIcon 
                              className="w-6 h-6" 
                              style={{ color: iconColor }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 text-center capitalize">
                            {visual.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EnhancedStyleSuggestions;
