import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface HealthQuestion {
  id: string;
  text: string;
  type: 'yes_no' | 'text' | 'multiple_choice';
  options?: string[];
  weight: number; // For scoring recommendation
}

interface PatientResponse {
  questionId: string;
  answer: string;
  timestamp: Date;
}

/**
 * AI Health Assistant Chat Interface
 * 
 * Features:
 * - WhatsApp-style chat layout with smooth animations
 * - Sequential health screening questions
 * - Dynamic recommendation engine
 * - Typing indicators and message animations
 * - Responsive design with mobile-optimized chat
 * 
 * TODO: AI Integration
 * - Replace getNextQuestion with actual AI API calls
 * - Integrate with VITE_API_KEY for AI service
 * - Implement dynamic question generation based on responses
 * 
 * TODO: Database Integration
 * - Save patient responses using savePatientResponse
 * - Retrieve patient history with getPatientHistory
 * - Use VITE_DATABASE_URL for data persistence
 */
const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<PatientResponse[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState<'hospital' | 'rest' | null>(null);

  // Health screening questions array
  const healthQuestions: HealthQuestion[] = [
    {
      id: 'q1',
      text: "Hello! I'm your AI health assistant. Are you experiencing any fever or high temperature?",
      type: 'yes_no',
      weight: 3
    },
    {
      id: 'q2',
      text: "Do you have difficulty breathing or shortness of breath?",
      type: 'yes_no',
      weight: 4
    },
    {
      id: 'q3',
      text: "Are you experiencing chest pain or discomfort?",
      type: 'yes_no',
      weight: 4
    },
    {
      id: 'q4',
      text: "How would you rate your current pain level?",
      type: 'multiple_choice',
      options: ['No pain (0)', 'Mild (1-3)', 'Moderate (4-6)', 'Severe (7-10)'],
      weight: 2
    },
    {
      id: 'q5',
      text: "Have you had any recent changes in your appetite or weight?",
      type: 'yes_no',
      weight: 1
    },
    {
      id: 'q6',
      text: "Are you taking any medications or have any known allergies?",
      type: 'text',
      weight: 1
    },
    {
      id: 'q7',
      text: "Is there anything else about your current health condition you'd like to mention?",
      type: 'text',
      weight: 1
    }
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with first question
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage(healthQuestions[0].text);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addMessage = (content: string, type: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      addMessage(content, 'bot');
    }, 1500);
  };

  const handleUserResponse = async (answer: string) => {
    // Add user message
    addMessage(answer, 'user');

    // Save response
    const response: PatientResponse = {
      questionId: healthQuestions[currentQuestionIndex].id,
      answer,
      timestamp: new Date()
    };

    const newResponses = [...userResponses, response];
    setUserResponses(newResponses);

    // TODO: Save to database
    // await savePatientResponse(user.id, response.questionId, response.answer);

    // Check if we have more questions
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    if (nextQuestionIndex < healthQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      
      // TODO: Replace with AI API call
      // const nextQuestion = await getNextQuestion(newResponses);
      
      setTimeout(() => {
        addBotMessage(healthQuestions[nextQuestionIndex].text);
      }, 2000);
    } else {
      // Generate recommendation
      generateRecommendation(newResponses);
    }

    setTextInput('');
  };

  /**
   * Generate health recommendation based on responses
   * TODO: Replace with actual AI analysis
   */
  const generateRecommendation = (responses: PatientResponse[]) => {
    let riskScore = 0;

    responses.forEach((response, index) => {
      const question = healthQuestions[index];
      
      // Simple scoring logic (replace with AI analysis)
      if (question.type === 'yes_no' && response.answer.toLowerCase() === 'yes') {
        riskScore += question.weight;
      }
      
      if (question.type === 'multiple_choice') {
        if (response.answer.includes('Severe')) riskScore += 4;
        else if (response.answer.includes('Moderate')) riskScore += 2;
        else if (response.answer.includes('Mild')) riskScore += 1;
      }
    });

    const recommendHospital = riskScore >= 6;
    setRecommendation(recommendHospital ? 'hospital' : 'rest');

    setTimeout(() => {
      const recommendationMessage = recommendHospital
        ? "Based on your responses, I recommend seeking immediate medical attention. Please visit a hospital or contact your healthcare provider."
        : "Based on your responses, it appears you may benefit from rest and monitoring your symptoms. However, if symptoms worsen, please seek medical attention.";
      
      addBotMessage(recommendationMessage);
      setIsCompleted(true);
    }, 2000);
  };

  const currentQuestion = healthQuestions[currentQuestionIndex];

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const typingVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.6, repeat: Infinity }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-blue-900"
    >
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">AI Health Assistant</h1>
                <p className="text-gray-300 text-sm">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="text-white hover:bg-white hover:bg-opacity-10"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs sm:max-w-md lg:max-w-lg ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}>
                    {message.type === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                    message.type === 'bot'
                      ? 'bg-white bg-opacity-90 text-gray-800 rounded-bl-sm'
                      : 'bg-blue-500 text-white rounded-br-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'bot' ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-start"
            >
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white bg-opacity-90 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <motion.div
                    variants={typingVariants}
                    animate="animate"
                    className="flex space-x-1"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Final Recommendation Card */}
          {isCompleted && recommendation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center mt-8"
            >
              <Card className={`max-w-md ${
                recommendation === 'hospital'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="text-center p-6">
                  {recommendation === 'hospital' ? (
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  )}
                  <h3 className={`text-lg font-semibold mb-2 ${
                    recommendation === 'hospital' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    Health Assessment Complete
                  </h3>
                  <p className={`text-sm ${
                    recommendation === 'hospital' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {recommendation === 'hospital'
                      ? 'Please seek medical attention promptly'
                      : 'Continue monitoring your symptoms'
                    }
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isCompleted && !isTyping && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white bg-opacity-10 backdrop-blur-sm border-t border-white border-opacity-20"
          >
            {currentQuestion.type === 'yes_no' && (
              <div className="flex space-x-4 justify-center">
                <Button
                  onClick={() => handleUserResponse('Yes')}
                  variant="primary"
                  className="px-8 py-3 shadow-lg"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleUserResponse('No')}
                  variant="secondary"
                  className="px-8 py-3 shadow-lg"
                >
                  No
                </Button>
              </div>
            )}

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleUserResponse(option)}
                    variant="secondary"
                    className="text-left justify-start p-4 shadow-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && textInput.trim()) {
                      handleUserResponse(textInput);
                    }
                  }}
                />
                <Button
                  onClick={() => textInput.trim() && handleUserResponse(textInput)}
                  variant="primary"
                  disabled={!textInput.trim()}
                  className="px-6 py-3 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * TODO: Backend Integration Functions
 * These functions should be replaced with actual API calls
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const savePatientResponse = async (userId: string, questionId: string, answer: string) => {
  // TODO: Save to database using VITE_DATABASE_URL
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/responses`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  //   },
  //   body: JSON.stringify({ userId, questionId, answer, timestamp: new Date().toISOString() })
  // });
  // return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPatientHistory = async (userId: string) => {
  // TODO: Retrieve patient's previous sessions
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/${userId}/history`, {
  //   headers: {
  //     'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  //   }
  // });
  // return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNextQuestion = async (previousAnswers: PatientResponse[]) => {
  // TODO: Replace with actual AI API integration
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/next-question`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  //   },
  //   body: JSON.stringify({ previousAnswers })
  // });
  // return response.json();
};

export default ChatbotPage;