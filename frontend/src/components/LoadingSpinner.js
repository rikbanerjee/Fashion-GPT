import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-16 h-16"
      >
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-2 bg-white/10 rounded-full"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 