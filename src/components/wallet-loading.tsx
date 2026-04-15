import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';

interface WalletLoadingProps {
  darkMode: boolean;
}

export function WalletLoading({ darkMode }: WalletLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${
        darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'
      }`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10'
              : 'bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-blue-500/10'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Rotating Wallet Icon with Circular Border */}
        <div className="relative">
          {/* Outer Rotating Border */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              darkMode 
                ? 'border-2 border-transparent bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500'
                : 'border-2 border-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500'
            }`}
            style={{
              width: '120px',
              height: '120px',
              backgroundClip: 'padding-box',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '3px'
            }}
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Inner Circle Background */}
          <div className={`relative flex items-center justify-center rounded-full ${
            darkMode 
              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-600/20'
              : 'bg-gradient-to-br from-blue-500/20 to-violet-600/20'
          }`}
            style={{
              width: '120px',
              height: '120px',
            }}
          >
            {/* Wallet Icon */}
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Wallet 
                className={`w-12 h-12 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <motion.h3
            className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading Buy Accounts
          </motion.h3>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Preparing your secure marketplace...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${
                darkMode ? 'bg-cyan-400' : 'bg-blue-600'
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
