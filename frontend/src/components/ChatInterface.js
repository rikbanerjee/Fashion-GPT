import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';

const ChatInterface = ({ isOpen, onClose, chatHistory, sendMessage, analysis }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFollowUpQuestion, setCurrentFollowUpQuestion] = useState('');
  

  const inputRef = useRef(null);
  const chatLogRef = useRef(null);

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send suggestion to backend
      const response = await sendMessage(suggestion);
      
      // Create bot message with only the answer
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Store follow-up question and suggestions separately
      setCurrentFollowUpQuestion(response.followUpQuestion || '');
      
      // Clear old suggestions but keep follow-up question
      const container = document.getElementById('suggestion-chips-container');
      if (container) {
        container.innerHTML = '';
      }
      
      if (response.suggestedReplies && response.suggestedReplies.length > 0) {
        createSuggestionChips(response.suggestedReplies);
      }
    } catch (error) {
      console.error('Failed to send suggestion:', error);
      
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create and display new suggestion chips
  const createSuggestionChips = React.useCallback((suggestions) => {
    const container = document.getElementById('suggestion-chips-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create new suggestion chips
    suggestions.forEach((suggestion, index) => {
      const button = document.createElement('button');
      button.className = 'px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors mr-2 mb-2';
      button.textContent = suggestion;
      button.onclick = () => handleSuggestionClick(suggestion);
      
      container.appendChild(button);
    });
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatLogRef.current) {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      // Lock background scrolling
      document.body.classList.add('overflow-hidden');
      
      // Initialize chat with openingLine and suggestedReplies if analysis exists
      if (analysis && analysis.analysis) {
        console.log('Analysis data available:', analysis.analysis);
        console.log('Suggested replies:', analysis.analysis.suggestedReplies);
        console.log('Opening line:', analysis.analysis.openingLine);
        
        if (chatHistory.length === 0) {
          // First time opening chat - show opening message and suggestions
          const openingMessage = {
            id: 1,
            type: 'bot',
            content: analysis.analysis.openingLine || 'Great! We\'ve got your colors. Now, how can I help you refine the perfect look?',
            timestamp: new Date()
          };
          
          setMessages([openingMessage]);
          // Create initial suggestion chips
          setTimeout(() => {
            createSuggestionChips(analysis.analysis.suggestedReplies || []);
          }, 100);
        } else if (chatHistory.length === 2) {
          // Chat history has been initialized with analysis but no user interaction yet
          // Show conversation but replace the first bot message with opening line
          const displayMessages = chatHistory.map((msg, index) => {
            // Replace the first bot message (full analysis) with the opening line for display
            if (index === 1 && msg.role === 'model') {
              return {
                id: index + 1,
                type: 'bot',
                content: analysis.analysis.openingLine || 'Great! We\'ve got your colors. Now, how can I help you refine the perfect look?',
                timestamp: new Date()
              };
            }
            return {
              id: index + 1,
              type: msg.role === 'user' ? 'user' : 'bot',
              content: msg.parts[0].text,
              timestamp: new Date()
            };
          });
          setMessages(displayMessages);
          
          // Create initial suggestion chips
          setTimeout(() => {
            createSuggestionChips(analysis.analysis.suggestedReplies || []);
          }, 100);
        } else {
          // Chat history has more than 2 messages - user has interacted
          // Show conversation but replace the first bot message with opening line
          const displayMessages = chatHistory.map((msg, index) => {
            // Replace the first bot message (full analysis) with the opening line for display
            if (index === 1 && msg.role === 'model') {
              return {
                id: index + 1,
                type: 'bot',
                content: analysis.analysis.openingLine || 'Great! We\'ve got your colors. Now, how can I help you refine the perfect look?',
                timestamp: new Date()
              };
            }
            return {
              id: index + 1,
              type: msg.role === 'user' ? 'user' : 'bot',
              content: msg.parts[0].text,
              timestamp: new Date()
            };
          });
          setMessages(displayMessages);
          
          // Don't clear follow-up question or suggestions for ongoing conversations
          // Let the message handlers manage these
        }
      } else if (chatHistory.length > 0) {
        // No analysis but chat history exists
        const displayMessages = chatHistory.map((msg, index) => ({
          id: index + 1,
          type: msg.role === 'user' ? 'user' : 'bot',
          content: msg.parts[0].text,
          timestamp: new Date()
        }));
        setMessages(displayMessages);
      } else {
        // No analysis and no chat history - fallback welcome message
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: 'Great! We\'ve got your colors. Now, how can I help you refine the perfect look?',
            timestamp: new Date()
          }
        ]);
      }
      
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      // Unlock background scrolling
      document.body.classList.remove('overflow-hidden');
      // Reset state when chat closes
      setMessages([]);
      setCurrentFollowUpQuestion('');
    }
    
    // Cleanup function to ensure body scrolling is restored
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, chatHistory, analysis, createSuggestionChips]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await sendMessage(inputValue.trim());
      
      // Create bot message with only the answer
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Store follow-up question and suggestions separately
      setCurrentFollowUpQuestion(response.followUpQuestion || '');
      
      // Clear old suggestions but keep follow-up question
      const container = document.getElementById('suggestion-chips-container');
      if (container) {
        container.innerHTML = '';
      }
      
      if (response.suggestedReplies && response.suggestedReplies.length > 0) {
        createSuggestionChips(response.suggestedReplies);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
            <div ref={chatLogRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  </div>
                </motion.div>
              ))}
              
              {/* Follow-up Question */}
              {currentFollowUpQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-4 rounded-2xl bg-blue-50 text-gray-800 border border-blue-200">
                    <p className="text-sm leading-relaxed font-medium">{currentFollowUpQuestion}</p>
                  </div>
                </motion.div>
              )}
              
              {/* Suggestion Chips Container */}
              <div id="suggestion-chips-container" className="flex flex-wrap gap-2 justify-start">
                {/* Dynamic suggestion chips will be created here */}
              </div>
              
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