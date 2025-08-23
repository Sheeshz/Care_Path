import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Activity } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

/**
 * Landing Page Component
 * 
 * Features:
 * - Medical-themed gradient background
 * - Animated hero section with staggered animations
 * - Responsive design with mobile-first approach
 * - Accessibility-compliant interactive elements
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-blue-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-emerald-300 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Hero Icon */}
          <motion.div
            variants={itemVariants}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full blur-md opacity-30"
              />
              <div className="relative bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-full">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            AI Health
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
              Assistant
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Get personalized health guidance powered by AI. 
            Quick screening, smart recommendations, better health outcomes.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
          >
            {[
              { icon: Activity, title: "Smart Screening", desc: "AI-powered health assessment" },
              { icon: Shield, title: "Secure & Private", desc: "Your data stays protected" },
              { icon: Heart, title: "Personalized Care", desc: "Tailored recommendations" }
            ].map((feature, index) => (
              <Card key={index} className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
                <feature.icon className="w-8 h-8 text-emerald-300 mb-4 mx-auto" />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                onClick={() => navigate('/auth?mode=signin')}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-2xl shadow-emerald-500/25"
              >
                Sign In
              </Button>
            </motion.div>
            
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto shadow-2xl shadow-blue-500/25"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-sm mt-12"
          >
            Trusted by healthcare professionals worldwide
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;