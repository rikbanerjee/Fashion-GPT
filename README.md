# Fashion GPT 🎨

An AI-powered fashion color recommendation system that analyzes uploaded images and provides intelligent color suggestions using Google's Gemini API.

## Project Structure

```
fashion-gpt/
├── backend/                 # Backend server and API functions
│   ├── api/                # Vercel serverless functions
│   ├── server/             # Express.js server
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend application
│   ├── src/                # React source files
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── package.json            # Root package.json for scripts
└── vercel.json            # Vercel deployment configuration
```

## Features

- **AI-Powered Analysis**: Uses Gemini Pro Vision API for intelligent color analysis
- **Drag & Drop Upload**: Easy image upload with drag-and-drop functionality
- **Color Recommendations**: Get dominant colors, complementary colors, and style suggestions
- **Seasonal Guidance**: Understand which seasons your colors work best for
- **Color Psychology**: Learn what your color choices convey
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Processing**: Fast analysis with loading states and error handling

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Dropzone** - Drag-and-drop file upload
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini API** - AI-powered image analysis
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fashion-gpt
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### 3. Configure Environment Variables

1. Create environment file for backend:
```bash
cp backend/server/env.example backend/server/.env
```

2. Edit `backend/server/.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
```

### 4. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in your `.env` file

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5001`
- Frontend development server on `http://localhost:3000`

#### Run Separately

**Backend only:**
```bash
npm run backend
```

**Frontend only:**
```bash
npm run frontend
```

## Usage

1. **Upload Image**: Drag and drop or click to upload a fashion image
2. **Wait for Analysis**: The AI will analyze your image (usually takes 10-30 seconds)
3. **View Results**: Get detailed color recommendations including:
   - Dominant colors in your outfit
   - Complementary color suggestions
   - Seasonal recommendations
   - Style suggestions
   - Color psychology insights

## API Endpoints

### POST `/api/analyze-fashion`
Analyzes a fashion image and returns color recommendations.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` file

**Response:**
```json
{
  "success": true,
  "analysis": {
    "dominantColors": ["blue", "white"],
    "complementaryColors": ["navy", "cream"],
    "seasonalRecommendations": "These colors work well for spring and summer...",
    "styleSuggestions": ["Try pairing with neutral accessories", "Consider adding a pop of color"],
    "colorPsychology": "Blue conveys trust and professionalism..."
  },
  "originalImage": "data:image/jpeg;base64,..."
}
```

### GET `/api/health`
Health check endpoint.

## Deployment

### Vercel Deployment

The project is configured for Vercel deployment with:
- Frontend: React app built and served from `frontend/build`
- Backend: Serverless functions in `backend/api`

1. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

2. **Set Environment Variables** in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key

## Customization

### Colors
The application avoids orange colors as per design preferences. You can modify the color palette in:
- `frontend/src/components/ColorAnalysis.js` - Color mapping
- `frontend/tailwind.config.js` - Tailwind color configuration

### Styling
- Modify `frontend/src/index.css` for global styles
- Update `frontend/tailwind.config.js` for theme customization
- Edit component files for specific styling changes

### AI Prompts
Customize the AI analysis prompt in `backend/server/index.js` to get different types of recommendations.

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Make sure you've added your API key to `backend/server/.env`
   - Restart the server after adding the key

2. **"Failed to analyze image"**
   - Check your internet connection
   - Verify your Gemini API key is valid
   - Ensure the image file is under 10MB

3. **Port conflicts**
   - Change the PORT in `backend/server/.env` if 5001 is in use
   - Update the proxy in `frontend/package.json` if needed

### Development Tips

- Use browser dev tools to check for API errors
- Monitor the server console for detailed error messages
- Test with different image formats and sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

Built with ❤️ using React, Node.js, and Google Gemini AI