import React from 'react';
import { motion } from 'framer-motion';

// Phosphor Icons (Verified)
import { PiDress, PiTShirt, PiShirtFolded } from 'react-icons/pi';

// Font Awesome & Font Awesome 6 (Verified)
import { FaUserTie, FaGem } from 'react-icons/fa';


// Game Icons (Verified)
import {
  GiSkirt,
  GiHoodie,
  GiWool,
  GiPearlNecklace,
  GiBelt,
  GiBandana,
  GiHighHeel,
  GiDropEarrings,
  GiTrousers,
  GiConverseShoe,
  GiLeatherBoot,
} from 'react-icons/gi';

// Bootstrap Icons (Verified)
import { BsSmartwatch, BsHandbag } from 'react-icons/bs';

const EnhancedStyleSuggestions = ({ suggestionsByOccasion }) => {
  if (!suggestionsByOccasion || Object.keys(suggestionsByOccasion).length === 0) {
    return null;
  }

  // Conservative iconMap using only verified icons
  const iconMap = {
    // Clothing
    blazer: FaUserTie,
    dress: PiDress,
    shirt: PiTShirt,
    pants: GiTrousers,
    jeans: GiTrousers, // Added jeans
    skirt: GiSkirt,
    sweater: GiHoodie,
    jacket: FaUserTie,
    blouse: PiShirtFolded,
    trousers: GiTrousers,
    cardigan: GiWool,
    // Accessories
    watch: BsSmartwatch,
    necklace: GiPearlNecklace,
    belt: GiBelt,
    tie: FaUserTie,
    scarf: GiBandana,
    handbag: BsHandbag,
    shoes: GiHighHeel,
    sneaker: GiConverseShoe, // Added sneaker
    "leather shoes": GiLeatherBoot, // Added for Brown Leather Shoes
    "leather loafers": GiLeatherBoot, // Added for Brown Leather Shoes
    cufflinks: FaGem,
    bracelet: FaGem, // Corrected and verified
    earrings: GiDropEarrings,
  };

  // Color mapping for visual representation
  const colorMap = {
    navy: '#1e3a8a',
    beige: '#f5f5dc',
    white: '#ffffff',
    black: '#000000',
    gray: '#6b7280',
    darkgray: '#374151',
    charcoal: '#36454f',
    brown: '#a16207',
    silver: '#cbd5e1',
    gold: '#fbbf24',
    burgundy: '#991b1b',
    cream: '#fefce8',
    taupe: '#8b7355',
    powder: '#b0e0e6',
    rose: '#fda4af',
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

  const getIconComponent = (itemName) => {
    // Handle both new structured format and legacy string format
    const item = typeof itemName === 'object' ? itemName.item : itemName.split(' ').pop().toLowerCase();
    return iconMap[item] || FaUserTie; // Return FaUserTie as fallback if no icon found
  };

  const getIconColor = (itemName) => {
    // Handle both new structured format and legacy string format
    const color = typeof itemName === 'object' ? itemName.color : itemName.split(' ')[0].toLowerCase();
    return colorMap[color] || '#6b7280'; // Default gray if color not found
  };

  const getContrastColor = (backgroundColor) => {
    // For light colors, use a darker version for better visibility
    const lightColors = ['#fefce8', '#ffffff', '#f5f5dc', '#b0e0e6', '#fda4af']; // cream, white, beige, powder, rose
    if (lightColors.includes(backgroundColor)) {
      // Return a darker version of the same color family
      const colorMap = {
        '#fefce8': '#d97706', // cream -> amber
        '#ffffff': '#6b7280', // white -> gray
        '#f5f5dc': '#a16207', // beige -> brown
        '#b0e0e6': '#0891b2', // powder -> cyan
        '#fda4af': '#be185d', // rose -> pink
      };
      return colorMap[backgroundColor] || '#6b7280';
    }
    return backgroundColor;
  };

  const getDisplayName = (itemName) => {
    // Handle both new structured format and legacy string format
    return typeof itemName === 'object' ? itemName.displayName : itemName;
  };

  const getOccasionIcon = (occasion) => {
    switch (occasion?.toLowerCase()) {
      case 'formal':
        return FaUserTie; // Using a general tie icon for formality
      case 'business':
        return FaUserTie; // Using a general tie icon for business
      case 'casual':
        return FaUserTie; // Using a general icon for casual
      default:
        return FaUserTie; // Default to FaUserTie if occasion not found
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
        <FaUserTie className="w-6 h-6 text-indigo-600" /> {/* Using a general tie icon */}
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
                  <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    Suggested Items
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {visuals.map((visual, visualIndex) => {
                      const VisualIcon = getIconComponent(visual);
                      const iconColor = getIconColor(visual);
                      const contrastColor = getContrastColor(iconColor);
                      const displayName = getDisplayName(visual);
                      
                      return (
                        <motion.div
                          key={visualIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * visualIndex }}
                          className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer group"
                          title={`${displayName} - Click to see more details`}
                        >
                          <div
                            className="p-3 rounded-full border-2 border-gray-100 shadow-sm group-hover:border-gray-300 transition-colors duration-200"
                            style={{ backgroundColor: iconColor + '20' }}
                          >
                            <VisualIcon 
                              className="w-6 h-6" 
                              style={{ color: contrastColor }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-700 capitalize max-w-20">
                              {displayName}
                            </p>
                            <div 
                              className="w-3 h-3 rounded-full mx-auto mt-1 border border-gray-200"
                              style={{ backgroundColor: iconColor }}
                              title={`Color: ${displayName.split(' ')[0]}`}
                            />
                          </div>
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
