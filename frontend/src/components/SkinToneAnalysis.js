import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

const SkinToneAnalysis = ({ skinToneAnalysis }) => {
  if (!skinToneAnalysis) {
    return null;
  }

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getUndertoneIcon = (undertone) => {
    switch (undertone?.toLowerCase()) {
      case 'warm':
        return '🔥';
      case 'cool':
        return '❄️';
      case 'neutral':
        return '⚖️';
      default:
        return '👤';
    }
  };

  const getSeasonIcon = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '☀️';
      case 'autumn':
        return '🍂';
      case 'winter':
        return '❄️';
      default:
        return '📅';
    }
  };

  if (!skinToneAnalysis.detected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-800">Skin Tone Analysis</h3>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Analysis Not Available</h4>
              <p className="text-sm text-orange-700 leading-relaxed">
                {skinToneAnalysis.reasoning || "Skin tone analysis wasn't possible due to image quality or lighting conditions."}
              </p>
              <p className="text-sm text-orange-600 mt-2">
                Don't worry! We'll provide you with versatile color recommendations that work for most people.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">Personalized Analysis</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(skinToneAnalysis.confidence)}`}>
          {skinToneAnalysis.confidence} confidence
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Undertone Analysis */}
        {skinToneAnalysis.undertone && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">{getUndertoneIcon(skinToneAnalysis.undertone)}</span>
              <h4 className="font-semibold text-purple-800">Skin Undertone</h4>
            </div>
            <p className="text-lg font-medium text-purple-700 capitalize mb-2">
              {skinToneAnalysis.undertone}
            </p>
            <p className="text-sm text-purple-600">
              {skinToneAnalysis.undertone === 'warm' && "Warm undertones look great with gold jewelry and earthy colors."}
              {skinToneAnalysis.undertone === 'cool' && "Cool undertones are complemented by silver jewelry and jewel tones."}
              {skinToneAnalysis.undertone === 'neutral' && "Neutral undertones can wear both warm and cool colors beautifully."}
            </p>
          </motion.div>
        )}

        {/* Color Season */}
        {skinToneAnalysis.season && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">{getSeasonIcon(skinToneAnalysis.season)}</span>
              <h4 className="font-semibold text-blue-800">Color Season</h4>
            </div>
            <p className="text-lg font-medium text-blue-700 capitalize mb-2">
              {skinToneAnalysis.season}
            </p>
            <p className="text-sm text-blue-600">
              {skinToneAnalysis.season === 'spring' && "Spring colors are warm and bright, perfect for fresh and vibrant looks."}
              {skinToneAnalysis.season === 'summer' && "Summer colors are cool and soft, ideal for elegant and refined styles."}
              {skinToneAnalysis.season === 'autumn' && "Autumn colors are warm and rich, great for sophisticated and earthy looks."}
              {skinToneAnalysis.season === 'winter' && "Winter colors are cool and bold, perfect for dramatic and striking styles."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Analysis Reasoning */}
      {skinToneAnalysis.reasoning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Analysis Details</h4>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {skinToneAnalysis.reasoning}
          </p>
        </motion.div>
      )}

      {/* Personalized Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200"
      >
        <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
        <span className="text-sm font-medium text-purple-800">
          All recommendations below are personalized for your skin tone!
        </span>
      </motion.div>
    </motion.div>
  );
};

export default SkinToneAnalysis;
