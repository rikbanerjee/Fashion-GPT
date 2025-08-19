import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ImagePalette from './ImagePalette';
import SuggestedPalettes from './SuggestedPalettes';
import StyleGuide from './StyleGuide';
import SkinToneAnalysis from './SkinToneAnalysis';
import EnhancedStyleSuggestions from './EnhancedStyleSuggestions';

const ColorAnalysis = ({ analysis }) => {
  const { analysis: colorAnalysis, originalImage } = analysis;



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



      {/* Enhanced Analysis Results */}
      <div className="space-y-8">
        {/* Skin Tone Analysis - New Personalized Component */}
        {colorAnalysis.skinToneAnalysis && (
          <SkinToneAnalysis skinToneAnalysis={colorAnalysis.skinToneAnalysis} />
        )}

        {/* Image Palette - New Enhanced Component */}
        {colorAnalysis.imagePalette && colorAnalysis.imagePalette.length > 0 && (
          <ImagePalette imagePalette={colorAnalysis.imagePalette} />
        )}

        {/* Suggested Palettes - New Enhanced Component */}
        {colorAnalysis.suggestedPalettes && colorAnalysis.suggestedPalettes.length > 0 && (
          <SuggestedPalettes suggestedPalettes={colorAnalysis.suggestedPalettes} />
        )}

        {/* Enhanced Style Suggestions - New Component with Visual Icons */}
        {colorAnalysis.suggestionsByOccasion && (
          <EnhancedStyleSuggestions suggestionsByOccasion={colorAnalysis.suggestionsByOccasion} />
        )}

        {/* Style Guide - Seasonal Fit Only */}
        {colorAnalysis.seasonalFit && (
          <StyleGuide 
            seasonalFit={colorAnalysis.seasonalFit} 
          />
        )}

        {/* Legacy Components - Fallback for backward compatibility */}
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            {renderAnalysisSection(
              "Complementary Colors",
              <div>
                <p className="mb-3 text-gray-600">
                  These colors would work beautifully with your current piece:
                </p>
                {renderColorChips(colorAnalysis.complementaryColors)}
              </div>,
              <TrendingUp className="w-6 h-6 text-blue-300" />,
              0.1,
              true
            )}
          </div>

          {colorAnalysis.seasonalRecommendations && (
            <div className="md:col-span-2">
              <SeasonalRecommendations seasonalData={colorAnalysis.seasonalRecommendations} />
            </div>
          )}

          {colorAnalysis.styleSuggestions && (
            <div className="md:col-span-2">
              <StyleSuggestions styleData={colorAnalysis.styleSuggestions} />
            </div>
          )}

          {colorAnalysis.colorPsychology && (
            <div className="md:col-span-2">
              <ColorPsychology psychologyData={colorAnalysis.colorPsychology} dominantColors={colorAnalysis.dominantColors} />
            </div>
          )}

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
        */}
      </div>

      {/* Tips Section */}
      {/*
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
      */}
    </div>
  );
};

export default ColorAnalysis; 