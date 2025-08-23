import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { useAuth } from '../hooks/useAuth';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}

/**
 * Authentication Page Component
 * 
 * Features:
 * - Unified Sign In/Sign Up interface with smooth transitions
 * - Form validation with real-time feedback
 * - Password visibility toggle
 * - Integration-ready API placeholders
 * - Responsive design with accessibility features
 * 
 * TODO: Backend Integration
 * - Replace handleSignIn/handleSignUp with actual API calls
 * - Integrate with VITE_BACKEND_URL/auth endpoints
 * - Use VITE_API_KEY for authentication
 */
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, isLoading } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Update mode based on URL params
  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validation
    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/chat');
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Authentication failed' });
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    navigate(`/auth?mode=${!isSignUp ? 'signup' : 'signin'}`);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-blue-900 flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </motion.div>

        <Card className="bg-white bg-opacity-10 backdrop-blur-lg border-white border-opacity-20 shadow-2xl">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="p-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-300">
                {isSignUp 
                  ? 'Join thousands of users getting better health insights' 
                  : 'Sign in to continue your health journey'
                }
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Full Name - Sign Up Only */}
                {isSignUp && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Input
                      type="text"
                      placeholder="Full Name"
                      icon={User}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      error={errors.fullName}
                      className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-300"
                    />
                  </motion.div>
                )}

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-300"
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={errors.password}
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-300"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-300 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                </motion.div>

                {/* Confirm Password - Sign Up Only */}
                {isSignUp && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      icon={Lock}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-300"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* General Error */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-lg text-sm"
                >
                  {errors.general}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Processing...
                    </div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </Button>
              </motion.div>

              {/* Toggle Mode */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-gray-300">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-2 text-emerald-300 hover:text-emerald-200 font-semibold hover:underline transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </Card>
      </div>
    </motion.div>
  );
};

export default AuthPage;