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

    // Create the prompt for fashion analysis with skin tone personalization
    const prompt = `
    Analyze this fashion image and provide personalized color recommendations. 

    FIRST: Assess if skin tone analysis is possible:
    - Is skin clearly visible in the image?
    - Is the lighting natural and even?
    - Can you identify undertones (warm/cool/neutral)?
    - Are there any artificial lighting effects that might distort skin color?

    IF skin tone analysis is possible:
    - Determine skin undertone (warm/cool/neutral) and color season (spring/summer/autumn/winter)
    - Provide personalized color recommendations based on skin tone
    - Include seasonal adjustments for the individual
    - Recommend colors that complement the specific skin undertone

    IF skin tone analysis is NOT possible:
    - Provide enhanced general color recommendations
    - Focus on the clothing colors and style context
    - Include versatile color suggestions that work for most people
    - Explain why skin tone analysis wasn't possible

    Format your response as JSON with the following structure:
    {
      "skinToneAnalysis": {
        "detected": boolean,
        "undertone": "warm|cool|neutral|null",
        "season": "spring|summer|autumn|winter|null",
        "confidence": "high|medium|low",
        "reasoning": "explanation of why skin tone was or wasn't detected and any limitations"
      },
      "colorAnalysis": {
        "imagePalette": [
          {"name": "Color Name", "hex": "#hexcode", "role": "Base|Accent|Secondary", "item": "Specific clothing item or accessory"}
        ],
        "suggestedPalettes": [
          {
            "name": "Palette Name",
            "description": "Brief description of the palette and its effect",
            "colors": [
              {"name": "Color Name", "hex": "#hexcode"}
            ]
          }
        ],
        "colorPsychology": "Brief description of the psychological impact of the main colors"
      },
      "styleGuide": {
        "seasonalFit": {
          "bestSeasons": ["season1", "season2"],
          "avoidSeasons": ["season1"],
          "rationale": "Explanation of why these seasons work or don't work"
        },
        "suggestionsByOccasion": {
          "formal": "Specific styling advice for formal occasions",
          "business": "Specific styling advice for business settings",
          "casual": "Specific styling advice for casual settings"
        },
        "personalizedAdjustments": {
          "bestColors": ["color1", "color2", "color3"],
          "avoidColors": ["color1", "color2"],
          "seasonalModifications": {
            "spring": "Personalized spring adjustments",
            "summer": "Personalized summer adjustments",
            "fall": "Personalized fall adjustments",
            "winter": "Personalized winter adjustments"
          }
        }
      },
      "conversation": {
        "openingLine": "A short, friendly, single-sentence string that mentions a positive highlight and asks a question",
        "suggestedReplies": [
          {"text": "Reply text", "action": "action_command"},
          {"text": "Reply text", "action": "action_command"}
        ]
      }
    }

    For the skinToneAnalysis object, include:
    1. **detected**: Boolean indicating if skin tone analysis was possible
    2. **undertone**: "warm", "cool", "neutral", or null if not detected
    3. **season**: "spring", "summer", "autumn", "winter", or null if not detected
    4. **confidence**: "high", "medium", or "low" based on image quality and skin visibility
    5. **reasoning**: Detailed explanation of the analysis or why it wasn't possible

    For the colorAnalysis object, include:
    1. **imagePalette**: Array of objects with "name" (color name), "hex" (hex color code), "role" (Base/Accent/Secondary), and "item" (specific clothing item or accessory)
    2. **suggestedPalettes**: Array of curated palette objects with "name", "description", and "colors" array
    3. **colorPsychology**: Brief description of the psychological impact

    For the styleGuide object, include:
    1. **seasonalFit**: Object with "bestSeasons", "avoidSeasons" arrays, and "rationale" explanation
    2. **suggestionsByOccasion**: Object with specific advice for "formal", "business", and "casual" occasions
    3. **personalizedAdjustments**: Object with personalized color recommendations based on skin tone analysis

    For the conversation object, include:
    1. **openingLine**: Engaging opening that mentions specific colors and asks a relevant question
    2. **suggestedReplies**: Array of objects with "text" and "action" keys for interactive UI commands

    IMPORTANT: For each color, provide both the color name and its accurate hex code. Use standard hex codes like #FF0000 for red, #0000FF for blue, etc. Be precise with the hex codes to match the actual colors in the image.

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
    // the below console shows the API and Key
    // console.log('API URL:', `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
    // the below console shows the request payload structure
    // console.log('Request Payload Structure:', JSON.stringify({
    //   contents: requestPayload.contents,
    //   generationConfig: requestPayload.generationConfig
    // }, null, 2));
    
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
      
      const parsedResponse = JSON.parse(jsonText);
      console.log('Successfully parsed analysis:', parsedResponse);
      
      // Check if this is the new enhanced format with skin tone analysis
      if (parsedResponse.skinToneAnalysis && parsedResponse.colorAnalysis && parsedResponse.styleGuide && parsedResponse.conversation) {
        // New enhanced format with skin tone analysis - combine all sections
        analysis = {
          // Skin tone analysis section
          skinToneAnalysis: parsedResponse.skinToneAnalysis || {},
          
          // Color analysis section
          imagePalette: parsedResponse.colorAnalysis.imagePalette || [],
          suggestedPalettes: parsedResponse.colorAnalysis.suggestedPalettes || [],
          colorPsychology: parsedResponse.colorAnalysis.colorPsychology || "",
          
          // Style guide section
          seasonalFit: parsedResponse.styleGuide.seasonalFit || {},
          suggestionsByOccasion: parsedResponse.styleGuide.suggestionsByOccasion || {},
          personalizedAdjustments: parsedResponse.styleGuide.personalizedAdjustments || {},
          
          // Conversation section
          openingLine: parsedResponse.conversation.openingLine || "Great! I've analyzed your fashion image. What would you like to know more about?",
          suggestedReplies: parsedResponse.conversation.suggestedReplies || ["Tell me about the colors", "What occasions work best?", "Show me style suggestions"],
          
          // Legacy compatibility - map new structure to old for existing components
          dominantColors: parsedResponse.colorAnalysis.imagePalette?.map(color => ({ name: color.name, hex: color.hex })) || [],
          complementaryColors: parsedResponse.colorAnalysis.suggestedPalettes?.[0]?.colors || [],
          seasonalRecommendations: parsedResponse.styleGuide.seasonalFit || {},
          styleSuggestions: parsedResponse.styleGuide.suggestionsByOccasion || {}
        };
      } else if (parsedResponse.colorAnalysis && parsedResponse.styleGuide && parsedResponse.conversation) {
        // Enhanced format without skin tone analysis - combine all sections
        analysis = {
          // Color analysis section
          imagePalette: parsedResponse.colorAnalysis.imagePalette || [],
          suggestedPalettes: parsedResponse.colorAnalysis.suggestedPalettes || [],
          colorPsychology: parsedResponse.colorAnalysis.colorPsychology || "",
          
          // Style guide section
          seasonalFit: parsedResponse.styleGuide.seasonalFit || {},
          suggestionsByOccasion: parsedResponse.styleGuide.suggestionsByOccasion || {},
          
          // Conversation section
          openingLine: parsedResponse.conversation.openingLine || "Great! I've analyzed your fashion image. What would you like to know more about?",
          suggestedReplies: parsedResponse.conversation.suggestedReplies || ["Tell me about the colors", "What occasions work best?", "Show me style suggestions"],
          
          // Legacy compatibility - map new structure to old for existing components
          dominantColors: parsedResponse.colorAnalysis.imagePalette?.map(color => ({ name: color.name, hex: color.hex })) || [],
          complementaryColors: parsedResponse.colorAnalysis.suggestedPalettes?.[0]?.colors || [],
          seasonalRecommendations: parsedResponse.styleGuide.seasonalFit || {},
          styleSuggestions: parsedResponse.styleGuide.suggestionsByOccasion || {}
        };
      } else if (parsedResponse.fullAnalysis && typeof parsedResponse.fullAnalysis === 'object') {
        // Legacy format with fullAnalysis object
        analysis = {
          ...parsedResponse.fullAnalysis,
          openingLine: parsedResponse.openingLine || "Great! I've analyzed your fashion image. What would you like to know more about?",
          suggestedReplies: parsedResponse.suggestedReplies || ["Tell me about the colors", "What occasions work best?", "Show me style suggestions"]
        };
      } else {
        // Legacy format - wrap in new structure
        analysis = {
          ...parsedResponse,
          openingLine: parsedResponse.openingLine || "Great! I've analyzed your fashion image. What would you like to know more about?",
          suggestedReplies: parsedResponse.suggestedReplies || ["Tell me about the colors", "What occasions work best?", "Show me style suggestions"]
        };
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.log('Raw text received:', text);
      
      // If JSON parsing fails, return the original fallback structure
      analysis = {
        rawResponse: text,
        dominantColors: [],
        complementaryColors: [],
        seasonalRecommendations: "Analysis completed",
        styleSuggestions: [],
        colorPsychology: "Color analysis provided",
        openingLine: "Great! I've analyzed your fashion image. What would you like to know more about?",
        suggestedReplies: ["Tell me about the colors", "What occasions work best?", "Show me style suggestions"]
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

// Conversational chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { history, initialAnalysis } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'History array is required in request body' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Add a system prompt to inform the AI that analysis is already complete and request structured response
    const contents = [
      {
        role: 'user',
        parts: [{ text: `IMPORTANT: You are a fashion stylist continuing a conversation. The initial image analysis has already been completed and is included in the chat history below. Do NOT ask for the image or outfit description again. Answer the user's latest query based on the analysis context provided.

CRITICAL: You must respond with a JSON object containing exactly these three keys:
1. "answer": A string containing your direct answer to the user's latest question
2. "followUpQuestion": A short, engaging, open-ended question to prompt the user for the next step
3. "suggestedReplies": An array of 3-4 contextually relevant strings that can be used as reply buttons

Example response format:
{
  "answer": "Based on your blue and white outfit, I recommend navy and cream as complementary colors.",
  "followUpQuestion": "What occasion are you dressing for?",
  "suggestedReplies": ["A casual day out", "A formal event", "Show me accessories", "What about shoes?"]
}

Respond ONLY with valid JSON.` }]
      },
      ...history
    ];

    // Prepare the request payload for Gemini API
    const requestPayload = {
      contents: contents,
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
    console.log('Making chat request to Gemini API...');
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

    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('No candidates in Gemini response: ' + JSON.stringify(response.data));
    }

    const text = response.data.candidates[0].content.parts[0].text;

    // Parse the JSON response from Gemini
    let structuredResponse;
    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = text;
      if (text.includes('```json')) {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      
      structuredResponse = JSON.parse(jsonText);
      
      // Validate the required keys
      if (!structuredResponse.answer || !structuredResponse.followUpQuestion || !structuredResponse.suggestedReplies) {
        throw new Error('Missing required keys in response');
      }
      
      console.log('Successfully parsed structured response:', structuredResponse);
      
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.log('Raw text received:', text);
      
      // Fallback response if JSON parsing fails
      structuredResponse = {
        answer: text,
        followUpQuestion: "What else can I help you with?",
        suggestedReplies: ["Tell me more about the colors", "What occasions work best?", "Show me style suggestions", "Help me with accessories"]
      };
    }

    res.json({
      success: true,
      ...structuredResponse
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    let errorDetails = error.message;
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      errorDetails = `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      errorDetails = 'Network error - no response received';
    }
    
    res.status(500).json({
      error: 'Failed to process chat request',
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