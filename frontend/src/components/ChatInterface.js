import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ChatInterface = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Initialize chat with welcome message
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: 'Great! We\'ve got your colors. Now, how can I help you refine the perfect look?',
            timestamp: new Date()
          }
        ]);
        setShowSuggestions(true);
      }
      
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getBotResponse(inputValue.trim());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        products: response.products
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getBotResponse(suggestion);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        products: response.products
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('occasion') || input.includes('event')) {
      return {
        content: "Perfect! Let me help you find the right look for your occasion. Here are some stylish options that would work great with your color palette:",
        products: [
          { title: "Elegant Evening Dress", price: "$89.99" },
          { title: "Classic Blazer", price: "$129.99" },
          { title: "Statement Necklace", price: "$45.99" },
          { title: "Silk Scarf", price: "$32.99" }
        ]
      };
    } else if (input.includes('shoe') || input.includes('footwear')) {
      return {
        content: "Great choice! Shoes can make or break an outfit. Here are some fabulous footwear options that complement your style:",
        products: [
          { title: "Leather Ankle Boots", price: "$149.99" },
          { title: "Classic Pumps", price: "$89.99" },
          { title: "Comfortable Flats", price: "$69.99" },
          { title: "Statement Heels", price: "$119.99" }
        ]
      };
    } else if (input.includes('don\'t like') || input.includes('hate') || input.includes('dislike')) {
      return {
        content: "No worries! Let's find colors that work better for you. What colors do you typically feel most confident in? I can suggest alternatives that might be more your style.",
        products: null
      };
    } else if (input.includes('color') || input.includes('colour')) {
      return {
        content: "Great question about colors! I can help you with color coordination, seasonal color analysis, and finding the perfect color combinations for your style. What specific color advice are you looking for?",
        products: null
      };
    } else if (input.includes('style') || input.includes('fashion')) {
      return {
        content: "I'd love to help with your style! I can provide advice on outfit coordination, seasonal trends, and personal style development. What aspect of style would you like to explore?",
        products: null
      };
    } else if (input.includes('outfit') || input.includes('clothing')) {
      return {
        content: "Perfect! I can help you put together amazing outfits. I can suggest combinations, recommend pieces, and help you build a cohesive wardrobe. What type of outfit are you thinking about?",
        products: null
      };
    } else if (input.includes('hello') || input.includes('hi')) {
      return {
        content: "Hello! I'm here to help you with all things fashion and style. Feel free to ask me about colors, outfits, trends, or any fashion-related questions!",
        products: null
      };
    } else {
      return {
        content: "That's an interesting question! I'm here to help with fashion advice, color coordination, style tips, and wardrobe suggestions. Could you tell me more about what you're looking for?",
        products: null
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Product carousel component
  const ProductCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    const scrollToNext = () => {
      if (currentIndex < products.length - 1) {
        setCurrentIndex(currentIndex + 1);
        carouselRef.current?.scrollTo({
          left: (currentIndex + 1) * 280,
          behavior: 'smooth'
        });
      }
    };

    const scrollToPrev = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        carouselRef.current?.scrollTo({
          left: (currentIndex - 1) * 280,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Recommended Products</h4>
          <div className="flex space-x-2">
            <button
              onClick={scrollToPrev}
              disabled={currentIndex === 0}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToNext}
              disabled={currentIndex === products.length - 1}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Product Image</div>
              </div>
              <div className="p-3">
                <h5 className="font-medium text-gray-800 text-sm mb-1">{product.title}</h5>
                <p className="text-indigo-600 font-semibold text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">Chat with Your Stylist</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                    
                    {/* Product Carousel for bot messages */}
                    {message.type === 'bot' && message.products && (
                      <div className="mt-4">
                        <ProductCarousel products={message.products} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Suggestion Chips */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {['What\'s the occasion?', 'Show me shoe options', 'I don\'t like these colors'].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface; 