import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  darkMode: boolean;
}

export function AnimatedBackground({ darkMode }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Enhanced Particle system with directional flow
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      baseOpacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        // Particles flow toward the right (positive X direction)
        this.speedX = Math.random() * 0.8 + 0.3;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.baseOpacity = Math.random() * 0.6 + 0.3;
        this.opacity = this.baseOpacity;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around or fade at edges
        if (this.x > canvas.width) {
          this.x = 0;
          this.y = Math.random() * canvas.height;
        }
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Fade particles as they approach the right edge (creating transition effect)
        const distanceFromRight = canvas.width - this.x;
        if (distanceFromRight < 200) {
          this.opacity = this.baseOpacity * (distanceFromRight / 200);
        } else {
          this.opacity = this.baseOpacity;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = darkMode 
          ? `rgba(6, 182, 212, ${this.opacity})` 
          : `rgba(37, 99, 235, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = darkMode ? 'rgba(6, 182, 212, 0.5)' : 'rgba(37, 99, 235, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Energy waves flowing to the right
    class EnergyWave {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;

      constructor() {
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.angle = (Math.random() - 0.5) * 0.2; // Slight angle variation
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.width + 50) {
          this.x = -50;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y);
        
        if (darkMode) {
          gradient.addColorStop(0, `rgba(168, 85, 247, 0)`);
          gradient.addColorStop(0.5, `rgba(168, 85, 247, ${this.opacity})`);
          gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(124, 58, 237, 0)`);
          gradient.addColorStop(0.5, `rgba(124, 58, 237, ${this.opacity})`);
          gradient.addColorStop(1, `rgba(37, 99, 235, 0)`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y + this.length * Math.tan(this.angle));
        ctx.stroke();
      }
    }

    // Grid lines flowing downward
    class GridLine {
      y: number;
      speed: number;
      opacity: number;

      constructor() {
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.15 + 0.05;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        // Fade grid lines toward the right
        const gradient = ctx.createLinearGradient(0, this.y, canvas.width, this.y);
        
        if (darkMode) {
          gradient.addColorStop(0, `rgba(168, 85, 247, ${this.opacity})`);
          gradient.addColorStop(0.7, `rgba(168, 85, 247, ${this.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(168, 85, 247, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(124, 58, 237, ${this.opacity})`);
          gradient.addColorStop(0.7, `rgba(124, 58, 237, ${this.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(124, 58, 237, 0)`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas.width, this.y);
        ctx.stroke();
      }
    }

    // Create particles, energy waves, and grid lines
    const particles: Particle[] = [];
    const energyWaves: EnergyWave[] = [];
    const gridLines: GridLine[] = [];
    
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }
    
    for (let i = 0; i < 12; i++) {
      energyWaves.push(new EnergyWave());
    }
    
    for (let i = 0; i < 10; i++) {
      gridLines.push(new GridLine());
    }

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines first (background layer)
      gridLines.forEach(line => {
        line.update();
        line.draw();
      });

      // Draw energy waves (middle layer)
      energyWaves.forEach(wave => {
        wave.update();
        wave.draw();
      });

      // Draw particles (foreground layer)
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between close particles with fade toward right
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            // Calculate fade based on rightmost particle position
            const rightmostX = Math.max(p1.x, p2.x);
            const distanceFromRight = canvas.width - rightmostX;
            let connectionOpacity = 0.15 * (1 - distance / 120);
            
            if (distanceFromRight < 200) {
              connectionOpacity *= (distanceFromRight / 200);
            }

            ctx.strokeStyle = darkMode 
              ? `rgba(6, 182, 212, ${connectionOpacity})` 
              : `rgba(37, 99, 235, ${connectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div className={`relative w-full min-h-screen lg:min-h-screen transition-colors duration-500`}>
      {/* Solid Gradient Background - Adapts to theme */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-r from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a]'
          : 'bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100'
      }`} />
      
      {/* Canvas for animations */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Directional gradient overlay - flows toward right */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
        darkMode 
          ? 'bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent'
          : 'bg-gradient-to-r from-transparent via-blue-500/8 to-transparent'
      }`} />
      
      {/* Right edge subtle transition */}
      <div className={`absolute inset-y-0 right-0 w-96 transition-opacity duration-500 pointer-events-none ${
        darkMode 
          ? 'bg-gradient-to-l from-black/20 to-transparent'
          : 'bg-gradient-to-l from-white/30 to-transparent'
      }`} />

      {/* Integrated Branding - Solid, Clear, Clean */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center lg:text-left lg:items-start lg:justify-center lg:px-12 lg:pl-16 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative space-y-4 max-w-full"
        >
          
          <motion.h1 
            className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight break-words"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={`text-transparent bg-clip-text transition-all duration-500 ${
              darkMode 
                ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600'
            }`}
              style={{
                filter: darkMode 
                  ? 'drop-shadow(0 0 40px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.6)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                  : 'drop-shadow(0 0 40px rgba(37, 99, 235, 0.7)) drop-shadow(0 0 80px rgba(124, 58, 237, 0.5)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                WebkitTextStroke: darkMode ? '1px rgba(6, 182, 212, 0.4)' : '1px rgba(37, 99, 235, 0.3)'
              }}
            >
              GameXchange
            </span>
          </motion.h1>
          
          <motion.div 
            className={`relative h-1.5 w-32 sm:w-40 mx-auto lg:mx-0 rounded-full transition-all duration-500 ${
              darkMode 
                ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-500'
                : 'bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600'
            }`}
            style={{
              boxShadow: darkMode 
                ? '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)'
                : '0 0 30px rgba(37, 99, 235, 0.6), 0 0 60px rgba(124, 58, 237, 0.4)'
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
}