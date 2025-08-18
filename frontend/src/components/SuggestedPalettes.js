import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Eye } from 'lucide-react';

const SuggestedPalettes = ({ suggestedPalettes }) => {
  if (!suggestedPalettes || !Array.isArray(suggestedPalettes) || suggestedPalettes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">Suggested Color Palettes</h3>
      </div>

      <div className="space-y-6">
        {suggestedPalettes.map((palette, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            {/* Palette Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                  {palette.name}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{palette.description}</p>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="flex flex-wrap gap-3 mb-4">
              {palette.colors.map((color, colorIndex) => (
                <motion.div
                  key={colorIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * colorIndex }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} - ${color.hex}`}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-800 capitalize">{color.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Palette Preview */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>This palette creates a {palette.name.toLowerCase()} effect</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Usage Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-purple-800">How to Use These Palettes</h4>
        </div>
        <div className="text-sm text-purple-700 space-y-1">
          <p>• Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent</p>
          <p>• Mix and match colors from different palettes for unique combinations</p>
          <p>• Consider your skin tone and the occasion when choosing a palette</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuggestedPalettes;
