const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  trustProxy: true // Trust the proxy
});
app.use(limiter);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fashion GPT API is running' });
});

// List available models endpoint
app.get('/api/models', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    res.json({
      success: true,
      models: response.data.models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      error: 'Failed to fetch models',
      details: error.response?.data || error.message
    });
  }
});

// Main endpoint for fashion color analysis
app.post('/api/analyze-fashion', upload.single('image'), async (req, res) => {
  try {
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
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
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
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Make request to Gemini API
    console.log('Making request to Gemini API...');
    console.log('API URL:', `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    console.log('Request Payload Structure:', JSON.stringify({
      contents: requestPayload.contents,
      generationConfig: requestPayload.generationConfig
    }, null, 2));
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    console.log('Gemini API Response Status:', response.status);
    console.log('Gemini API Response Data:', JSON.stringify(response.data, null, 2));

    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('No candidates in Gemini response: ' + JSON.stringify(response.data));
    }

    const text = response.data.candidates[0].content.parts[0].text;

    // Try to parse JSON response, handling markdown code blocks
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      
      analysis = JSON.parse(jsonText);
      console.log('Successfully parsed analysis:', analysis);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.log('Raw text received:', text);
      
      // If JSON parsing fails, return the raw text
      analysis = {
        rawResponse: text,
        dominantColors: [],
        complementaryColors: [],
        seasonalRecommendations: "Analysis completed",
        styleSuggestions: [],
        colorPsychology: "Color analysis provided"
      };
    }

    res.json({
      success: true,
      analysis: analysis,
      originalImage: `data:${mimeType};base64,${base64Image}`
    });

  } catch (error) {
    console.error('Error analyzing fashion image:', error);
    
    let errorDetails = error.message;
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      errorDetails = `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      errorDetails = 'Network error - no response received';
    }
    
    res.status(500).json({
      error: 'Failed to analyze image',
      details: errorDetails
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Fashion GPT server running on port ${PORT}`);
}); 