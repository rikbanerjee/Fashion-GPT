const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content with image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

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
    } catch (error) {
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
    res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message
    });
  }
} 