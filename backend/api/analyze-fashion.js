const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Helper function to handle multer
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle file upload
    await runMiddleware(req, res, upload.single('image'));

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Convert image to base64
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Create the prompt for fashion analysis
    const prompt = `
    Analyze this fashion image and provide detailed color recommendations. Please respond with:

    1. **Dominant Colors**: Identify the main colors in the clothing
    2. **Color Harmony**: Suggest complementary colors that would work well
    3. **Seasonal Recommendations**: What seasons these colors work best for
    4. **Style Suggestions**: Recommend additional colors for different occasions
    5. **Color Psychology**: Brief explanation of what these colors convey

    Format your response as JSON with the following structure:
    {
      "dominantColors": ["color1", "color2"],
      "complementaryColors": ["color1", "color2"],
      "seasonalRecommendations": "description",
      "styleSuggestions": ["suggestion1", "suggestion2"],
      "colorPsychology": "description"
    }

    Focus on practical, wearable color combinations and avoid orange tones as they are not preferred.
    `;

    // Prepare the request payload for Gemini API
    const requestPayload = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Image } }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Make request to Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      requestPayload,
      { 
        headers: { 'Content-Type': 'application/json' }, 
        timeout: 30000 
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from markdown code blocks if present
    let jsonText = text;
    if (text.includes('```json')) {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }

    const analysis = JSON.parse(jsonText);

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error.response) {
      console.error('Gemini API Response Status:', error.response.status);
      console.error('Gemini API Response Data:', error.response.data);
    }

    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
}; 