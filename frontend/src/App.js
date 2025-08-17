import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, TrendingUp, Heart } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ColorAnalysis from './components/ColorAnalysis';
import LoadingSpinner from './components/LoadingSpinner';
import ChatInterface from './components/ChatInterface';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleAnalysisComplete = (result) => {
    console.log('Analysis complete, result:', result);
    setAnalysis(result);
    setLoading(false);
    setError(null);
    
    // Initialize chat history with the full analysis for AI context
    if (result && result.analysis) {
      const { dominantColors, complementaryColors, seasonalRecommendations, styleSuggestions, colorPsychology } = result.analysis;
      // Handle both new structured format and legacy format for styleSuggestions
      let styleSuggestionsText = 'N/A';
      if (styleSuggestions) {
        if (Array.isArray(styleSuggestions)) {
          // Legacy format - array of strings
          styleSuggestionsText = styleSuggestions.join(', ');
        } else if (typeof styleSuggestions === 'object') {
          // New structured format - object with categories
          const categories = Object.keys(styleSuggestions);
          const allSuggestions = categories.flatMap(category => {
            const suggestions = styleSuggestions[category];
            return Array.isArray(suggestions) ? suggestions.map(s => s.title || s) : [];
          });
          styleSuggestionsText = allSuggestions.join(', ');
        }
      }

      // Handle both new structured format and legacy format for seasonalRecommendations
      let seasonalText = 'N/A';
      if (seasonalRecommendations) {
        if (typeof seasonalRecommendations === 'string') {
          // Legacy format - string
          seasonalText = seasonalRecommendations;
        } else if (typeof seasonalRecommendations === 'object') {
          // New structured format - object with seasons
          const bestSeasons = seasonalRecommendations.bestSeasons || [];
          seasonalText = `Best for: ${bestSeasons.join(', ')}`;
        }
      }

      // Handle both new structured format and legacy format for colorPsychology
      let psychologyText = 'N/A';
      if (colorPsychology) {
        if (typeof colorPsychology === 'string') {
          // Legacy format - string
          psychologyText = colorPsychology;
        } else if (typeof colorPsychology === 'object') {
          // New structured format - object with aspects
          const aspects = [];
          if (colorPsychology.emotionalImpact) aspects.push(colorPsychology.emotionalImpact);
          if (colorPsychology.socialPerception) aspects.push(colorPsychology.socialPerception);
          psychologyText = aspects.join('. ');
        }
      }

      const fullAnalysisText = `
        Dominant Colors: ${dominantColors?.join(', ') || 'N/A'}
        Complementary Colors: ${complementaryColors?.join(', ') || 'N/A'}
        Seasonal Recommendations: ${seasonalText}
        Style Suggestions: ${styleSuggestionsText}
        Color Psychology: ${psychologyText}
      `.trim();
      
      // Initialize chat history with the full analysis as the first model turn
      const initialChatHistory = [
        { role: 'user', parts: [{ text: 'Analyze this image and give me fashion advice.' }] },
        { role: 'model', parts: [{ text: fullAnalysisText }] }
      ];
      
      setChatHistory(initialChatHistory);
    } else {
      setChatHistory([]);
    }
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleStartAnalysis = () => {
    setLoading(true);
    setError(null);
  };

  const sendChatMessage = async (userMessage) => {
    try {
      // Add user message to chat history
      const newUserMessage = {
        role: 'user',
        parts: [{ text: userMessage }]
      };
      
      const updatedHistory = [...chatHistory, newUserMessage];
      setChatHistory(updatedHistory);

      // Make API call to backend - only send the chat history
      // The full analysis is already included as the first model turn in the history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          history: updatedHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Add AI response to chat history using the answer from structured response
        const newModelMessage = {
          role: 'model',
          parts: [{ text: data.answer }]
        };
        
        setChatHistory([...updatedHistory, newModelMessage]);
        
        // Return the structured response for the ChatInterface to use
        return {
          answer: data.answer,
          followUpQuestion: data.followUpQuestion,
          suggestedReplies: data.suggestedReplies
        };
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Fashion GPT
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <p className="text-gray-700 text-lg mt-4">
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
                  className="mt-8 mx-auto block px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-200 border border-indigo-600"
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
              className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700"
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
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Why Choose Fashion GPT?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 shadow-sm">
                <Palette className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Smart Color Analysis
                </h3>
                <p className="text-gray-600">
                  AI-powered analysis of your clothing colors with detailed recommendations
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 shadow-sm">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Style Suggestions
                </h3>
                <p className="text-gray-600">
                  Get personalized style advice and complementary color combinations
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 shadow-sm">
                <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Fashion Psychology
                </h3>
                <p className="text-gray-600">
                  Understand the psychology behind colors and their impact on style
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Chat Button */}
      <motion.button
        id="open-chat-button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-full md:w-auto px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        onClick={() => setIsChatOpen(true)}
      >
        💬 Chat with Your Stylist
      </motion.button>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        chatHistory={chatHistory}
        sendMessage={sendChatMessage}
        analysis={analysis}
      />
    </div>
  );
}

export default App; 