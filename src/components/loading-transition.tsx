import { motion } from 'motion/react';
import gamepadIcon from 'figma:asset/ab6fcdd406fcfabd484263f71b27b6843fdcc1c1.png';

interface LoadingTransitionProps {
  darkMode: boolean;
}

export function LoadingTransition({ darkMode }: LoadingTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
      style={{
        background: darkMode 
          ? 'rgba(10, 10, 10, 0.95)' 
          : 'rgba(249, 250, 251, 0.95)'
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full blur-3xl ${
            darkMode 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600'
              : 'bg-gradient-to-r from-blue-600 to-violet-600'
          }`}
          style={{ width: '400px', height: '400px', left: '-100px', top: '-100px' }}
        />

        {/* Main container */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          
          {/* Rotating outer ring with neon glow */}
          <motion.div
            initial={{ rotate: 0, scale: 0 }}
            animate={{ 
              rotate: 360,
              scale: 1
            }}
            transition={{ 
              scale: { duration: 0.6, ease: "backOut" },
              rotate: { 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="absolute inset-0 rounded-full"
            style={{
              border: darkMode 
                ? '3px solid rgba(6, 182, 212, 0.4)'
                : '3px solid rgba(37, 99, 235, 0.4)',
              boxShadow: darkMode
                ? '0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.3)'
                : '0 0 20px rgba(37, 99, 235, 0.5), inset 0 0 20px rgba(37, 99, 235, 0.2)'
            }}
          />

          {/* Progress sweep ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90"
            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke={darkMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(124, 58, 237, 0.7)'}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 5,
                ease: "linear"
              }}
              style={{
                filter: darkMode 
                  ? 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.9))'
                  : 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.8))'
              }}
            />
          </svg>

          {/* Inner pulsing ring */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1, 0.9],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute rounded-full"
            style={{
              width: '170px',
              height: '170px',
              border: darkMode 
                ? '2px solid rgba(6, 182, 212, 0.3)'
                : '2px solid rgba(37, 99, 235, 0.3)',
              boxShadow: darkMode
                ? '0 0 15px rgba(6, 182, 212, 0.4)'
                : '0 0 15px rgba(37, 99, 235, 0.3)'
            }}
          />

          {/* Gamepad icon - counter-rotating for stability */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: 1,
              rotate: -360
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              scale: { duration: 0.6, ease: "backOut", delay: 0.2 },
              rotate: { 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              },
              exit: { duration: 0.5 }
            }}
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{
              width: '120px',
              height: '120px',
              filter: darkMode 
                ? 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 50px rgba(168, 85, 247, 0.5))'
                : 'drop-shadow(0 0 30px rgba(37, 99, 235, 0.5)) drop-shadow(0 0 50px rgba(124, 58, 237, 0.4))'
            }}
          >
            <img 
              src={gamepadIcon} 
              alt="Loading gamepad" 
              className="w-full h-full object-contain rounded-full"
            />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            delay: 0.4, 
            duration: 0.6,
            exit: { duration: 0.4 }
          }}
          className="absolute"
          style={{ top: 'calc(50% + 150px)' }}
        >
          <p className={`text-xl font-semibold transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Loading Dashboard
          </p>
          
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className={`w-2 h-2 rounded-full ${
                  darkMode 
                    ? 'bg-cyan-400'
                    : 'bg-blue-600'
                }`}
                style={{
                  boxShadow: darkMode
                    ? '0 0 8px rgba(6, 182, 212, 0.8)'
                    : '0 0 8px rgba(37, 99, 235, 0.7)'
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}