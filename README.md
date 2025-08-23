# AI Health Assistant

A production-ready React application for AI-powered health screening and recommendations.

## Features

- **Landing Page**: Medical-themed gradient design with smooth animations
- **Authentication System**: Unified Sign In/Sign Up with form validation
- **AI Health Assistant**: WhatsApp-style chat interface for health screening
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion transitions throughout
- **Production Ready**: Error boundaries, loading states, and proper architecture

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom medical theme
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your actual values
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx        # Hero section with CTAs
│   ├── AuthPage.tsx           # Sign In/Sign Up forms
│   ├── ChatbotPage.tsx        # AI health assistant chat
│   └── ui/                    # Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   └── useAuth.tsx            # Authentication logic
├── utils/
│   └── cn.ts                  # Class name utility
└── App.tsx                    # Main app with routing
```

## Backend Integration

The app is designed to easily integrate with backend services. Key integration points:

### Authentication API
```typescript
// In src/hooks/useAuth.tsx
const signIn = async (email: string, password: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_API_KEY
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

### Database Operations
```typescript
// In src/components/ChatbotPage.tsx
const savePatientResponse = async (userId: string, questionId: string, answer: string) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, questionId, answer, timestamp: new Date().toISOString() })
  });
  return response.json();
};
```

### AI Integration
```typescript
// Dynamic question generation
const getNextQuestion = async (previousAnswers: PatientResponse[]) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai/next-question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
    },
    body: JSON.stringify({ previousAnswers })
  });
  return response.json();
};
```

## Environment Variables

Required environment variables for full functionality:

```env
VITE_API_KEY=your_ai_api_key_here
VITE_BACKEND_URL=https://your-backend-url.com
VITE_DATABASE_URL=your_database_connection_string
```

## Design System

### Color Scheme
- **Primary**: Emerald green (#059669)
- **Secondary**: Sky blue (#0284c7)
- **Background**: Gradient from green-900 to blue-900
- **Text**: White and gray-100 for contrast

### Animation Guidelines
- Page transitions: 0.3s slide animations
- Button interactions: Scale and shadow effects
- Chat messages: Slide-in from appropriate sides
- Loading states: Pulse animations

## Demo Credentials

For testing the authentication system:
- Email: `demo@example.com`
- Password: `password`

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Configure environment variables** on your hosting platform

3. **Deploy the `dist` folder** to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details