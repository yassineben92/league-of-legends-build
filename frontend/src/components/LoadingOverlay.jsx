import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="text-center relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-hextech-blue border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-2 left-1/2 -ml-10 w-20 h-20 border-2 border-hextech-gold border-b-transparent rounded-full"
        />

        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl font-bold text-hextech-gold tracking-widest uppercase"
        >
          Consulting Gemini 3...
        </motion.h2>
        <p className="text-hextech-blue text-sm mt-2">Analyzing Current Patch Data</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
