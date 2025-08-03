import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Palette, Zap, TrendingUp, Heart } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ColorAnalysis from './components/ColorAnalysis';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysis(result);
    setLoading(false);
    setError(null);
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleStartAnalysis = () => {
    setLoading(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Fashion GPT
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Upload your fashion image and get AI-powered color recommendations
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!analysis && !loading && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ImageUpload
                  onAnalysisStart={handleStartAnalysis}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisError={handleAnalysisError}
                />
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <LoadingSpinner />
                <p className="text-white text-lg mt-4">
                  Analyzing your fashion image with AI...
                </p>
              </motion.div>
            )}

            {analysis && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ColorAnalysis analysis={analysis} />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAnalysis(null);
                    setError(null);
                  }}
                  className="mt-8 mx-auto block px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  Analyze Another Image
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg text-red-100"
            >
              <p className="text-center">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Features Section */}
        {!analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Why Choose Fashion GPT?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-effect p-6 rounded-xl text-center">
                <Palette className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Smart Color Analysis
                </h3>
                <p className="text-white/80">
                  AI-powered analysis of your clothing colors with detailed recommendations
                </p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <TrendingUp className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Style Suggestions
                </h3>
                <p className="text-white/80">
                  Get personalized style advice and complementary color combinations
                </p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Fashion Psychology
                </h3>
                <p className="text-white/80">
                  Understand the psychology behind colors and their impact on style
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App; 