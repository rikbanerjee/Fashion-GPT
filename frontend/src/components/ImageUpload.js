import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image, X } from 'lucide-react';
import axios from 'axios';

const ImageUpload = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      onAnalysisStart();
      
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('/api/analyze-fashion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      let errorMessage = 'Failed to analyze image. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      onAnalysisError(errorMessage);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!selectedFile ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...getRootProps()}
          className={`upload-area rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'dragover' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload Fashion Image'}
              </h3>
              <p className="text-white/80 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-white/60">
                Supports: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Preview Area */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image className="w-6 h-6 text-white" />
                <h3 className="text-xl font-semibold text-white">
                  Selected Image
                </h3>
              </div>
              <button
                onClick={handleRemoveImage}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="space-y-3">
                  <div>
                    <p className="text-white/80 text-sm">File Name</p>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">File Size</p>
                    <p className="text-white font-medium">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">File Type</p>
                    <p className="text-white font-medium">{selectedFile.type}</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  className="mt-6 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
                >
                  Analyze Colors with AI
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload; 