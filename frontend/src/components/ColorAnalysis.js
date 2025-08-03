import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, TrendingUp, Heart, Calendar, Lightbulb } from 'lucide-react';

const ColorAnalysis = ({ analysis }) => {
  const { analysis: colorAnalysis, originalImage } = analysis;

  // Color mapping for visual representation
  const colorMap = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#10b981',
    'yellow': '#f59e0b',
    'purple': '#8b5cf6',
    'pink': '#ec4899',
    'black': '#111827',
    'white': '#ffffff',
    'gray': '#6b7280',
    'brown': '#a16207',
    'navy': '#1e3a8a',
    'beige': '#f5f5dc',
    'cream': '#fefce8',
    'mint': '#a7f3d0',
    'lavender': '#e9d5ff',
    'coral': '#fb7185',
    'teal': '#14b8a6',
    'maroon': '#dc2626',
    'olive': '#84cc16',
    'gold': '#fbbf24',
    'silver': '#cbd5e1',
    'burgundy': '#991b1b',
    'emerald': '#059669',
    'sapphire': '#1d4ed8',
    'rose': '#fda4af',
    'indigo': '#6366f1',
    'cyan': '#06b6d4',
    'magenta': '#d946ef',
    'lime': '#84cc16',
    'orange': '#f97316', // Avoiding orange as per user preference
  };

  const getColorHex = (colorName) => {
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#6b7280'; // Default gray if not found
  };

  const renderColorChips = (colors) => {
    if (!colors || !Array.isArray(colors)) return null;
    
    return (
      <div className="flex flex-wrap gap-2 md:gap-3">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 bg-gray-100 rounded-full border border-gray-300 hover:bg-gray-200 transition-all duration-200"
          >
            <div
              className="color-chip"
              style={{ backgroundColor: getColorHex(color) }}
            ></div>
            <span className="text-gray-800 font-semibold capitalize text-xs md:text-sm">{color}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderAnalysisSection = (title, content, icon, delay = 0, isFullWidth = false) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm ${isFullWidth ? 'md:col-span-2' : ''}`}
      >
        <div className="flex items-center space-x-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-700">
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with original image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          <Sparkles className="inline w-8 h-8 mr-3 text-indigo-600" />
          Color Analysis Results
        </h2>
        
        <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl inline-block border border-gray-200 shadow-sm">
          <img
            src={originalImage}
            alt="Analyzed fashion"
            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      </motion.div>



      {/* Analysis Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complementary Colors */}
        {colorAnalysis.complementaryColors && colorAnalysis.complementaryColors.length > 0 && (
          renderAnalysisSection(
            "Complementary Colors",
            <div>
              <p className="mb-3 text-gray-600">
                These colors would work beautifully with your current piece:
              </p>
              {renderColorChips(colorAnalysis.complementaryColors)}
            </div>,
            <TrendingUp className="w-6 h-6 text-blue-300" />,
            0.1
          )
        )}

        {/* Dominant Colors */}
        {colorAnalysis.dominantColors && colorAnalysis.dominantColors.length > 0 && (
          renderAnalysisSection(
            "Dominant Colors",
            <div>
              <p className="mb-3 text-gray-600">
                These are the main colors identified in your fashion piece:
              </p>
              {renderColorChips(colorAnalysis.dominantColors)}
            </div>,
            <Palette className="w-6 h-6 text-purple-300" />,
            0.2
          )
        )}

        {/* Seasonal Recommendations */}
        {colorAnalysis.seasonalRecommendations && (
          renderAnalysisSection(
            "Seasonal Recommendations",
            <div>
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <p className="text-gray-700 leading-relaxed">
                  {colorAnalysis.seasonalRecommendations}
                </p>
              </div>
            </div>,
            <Calendar className="w-6 h-6 text-green-300" />,
            0.3
          )
        )}

        {/* Style Suggestions */}
        {colorAnalysis.styleSuggestions && colorAnalysis.styleSuggestions.length > 0 && (
          renderAnalysisSection(
            "Style Suggestions",
            <div>
              <ul className="space-y-3">
                {colorAnalysis.styleSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-indigo-600 mt-1 text-lg">•</span>
                    <span className="text-gray-700 leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>,
            <Lightbulb className="w-6 h-6 text-yellow-300" />,
            0.4,
            true
          )
        )}

        {/* Color Psychology */}
        {colorAnalysis.colorPsychology && (
          renderAnalysisSection(
            "Color Psychology",
            <div>
              <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                <p className="text-gray-700 leading-relaxed">
                  {colorAnalysis.colorPsychology}
                </p>
              </div>
            </div>,
            <Heart className="w-6 h-6 text-pink-300" />,
            0.5
          )
        )}

        {/* Raw Response (fallback) */}
        {colorAnalysis.rawResponse && !colorAnalysis.dominantColors && (
          renderAnalysisSection(
            "AI Analysis",
            <div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {colorAnalysis.rawResponse}
              </p>
            </div>,
            <Sparkles className="w-6 h-6 text-purple-300" />,
            0.6
          )
        )}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
      >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-600 mr-3" />
            Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Color Coordination</h4>
              <p>Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Seasonal Adaptation</h4>
              <p>Consider your skin tone and the season when choosing complementary colors.</p>
            </div>
          </div>
      </motion.div>
    </div>
  );
};

export default ColorAnalysis; 