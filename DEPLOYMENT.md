# Deployment Guide for Symptom Navigator

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI
\`\`\`bash
npm i -g vercel
\`\`\`

### 2. Deploy to Vercel
\`\`\`bash
# Login to Vercel
vercel login

# Deploy the project
vercel

# For production deployment
vercel --prod
\`\`\`

### 3. Environment Variables
In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-api.render.com`)

### 4. Auto-deploy from GitHub
1. Connect your GitHub repository in Vercel dashboard
2. Enable automatic deployments
3. Every push to main branch will trigger a new deployment

## Backend Deployment (Render)

### 1. Create Render Web Service
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository

### 2. Configure Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

### 3. Environment Variables
Add these in Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render default)

### 4. CORS Configuration
The API already includes CORS headers for frontend integration.

## Alternative Backend Deployment

### Railway
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
\`\`\`

### Heroku
\`\`\`bash
# Install Heroku CLI and login
heroku login

# Create app and deploy
heroku create your-app-name
git push heroku main
\`\`\`

## Testing the Deployment

1. Visit your frontend URL
2. Complete the symptom assessment
3. Verify the API calls work correctly
4. Test on mobile devices for responsiveness

## Monitoring

- Check Vercel Analytics for frontend performance
- Monitor Render logs for backend issues
- Set up error tracking (Sentry recommended)
