import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles } from 'lucide-react';

const ImagePalette = ({ imagePalette }) => {
  if (!imagePalette || !Array.isArray(imagePalette) || imagePalette.length === 0) {
    return null;
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'base':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accent':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'secondary':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'base':
        return '🎯';
      case 'accent':
        return '✨';
      case 'secondary':
        return '🎨';
      default:
        return '🎨';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-800">Your Image Palette</h3>
      </div>

      <div className="space-y-4">
        {imagePalette.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            {/* Color Swatch */}
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            
            {/* Color Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{getRoleIcon(color.role)}</span>
                <h4 className="font-semibold text-gray-800 capitalize">{color.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(color.role)}`}>
                  {color.role || 'Color'}
                </span>
              </div>
              {color.item && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Item:</span> {color.item}
                </p>
              )}
              <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Palette Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-indigo-800">Palette Breakdown</h4>
        </div>
        <p className="text-sm text-indigo-700">
          This palette uses {imagePalette.filter(c => c.role?.toLowerCase() === 'base').length} base color(s), 
          {imagePalette.filter(c => c.role?.toLowerCase() === 'accent').length} accent(s), and 
          {imagePalette.filter(c => c.role?.toLowerCase() === 'secondary').length} secondary color(s) 
          to create a balanced and harmonious look.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ImagePalette;
