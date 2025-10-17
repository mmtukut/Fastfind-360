import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeroProps {
  onGetStarted: () => void;
  totalBuildings: number;
  accuracy: number;
  revenue: number;
}

export default function Hero({ onGetStarted, totalBuildings, accuracy, revenue }: HeroProps) {
  const [displayBuildings, setDisplayBuildings] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [displayRevenue, setDisplayRevenue] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayBuildings(Math.floor(totalBuildings * progress));
      setDisplayAccuracy(Math.floor(accuracy * progress * 10) / 10);
      setDisplayRevenue(Math.floor(revenue * progress * 10) / 10);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayBuildings(totalBuildings);
        setDisplayAccuracy(accuracy);
        setDisplayRevenue(revenue);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [totalBuildings, accuracy, revenue]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: ['-10%', '110%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8"
          >
            <span className="text-2xl">🛰️</span>
            <span className="text-sm font-medium">Powered by Satellite Technology</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Nigeria's ₦2 Trillion
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Invisible Problem, Now Visible
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Detect, classify, and value every building in Nigeria using AI and satellite imagery.
            <span className="block mt-2 text-lg">
              From 3-5 years to <span className="font-bold text-yellow-300">48 hours</span>.
            </span>
          </motion.p>

          {/* Live Metrics Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">
                {displayBuildings.toLocaleString()}
              </div>
              <div className="text-sm text-blue-200">Buildings Detected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">{displayAccuracy}%</div>
              <div className="text-sm text-blue-200">AI Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold mb-1">₦{displayRevenue}B</div>
              <div className="text-sm text-blue-200">Revenue Potential</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300"
          >
            <span>Launch Detection System</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Secondary Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-blue-200"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live data from Gombe State • Updated in real-time
            </span>
          </motion.p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            '🎯 94.3% Accuracy',
            '⚡ 48 Hour Turnaround',
            '💰 90% Cost Reduction',
            '📊 Real-time Analytics',
            '🗺️ GIS Integration',
            '📱 Mobile Ready'
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-white/20"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
