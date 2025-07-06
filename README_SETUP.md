# Authentication Setup Guide

## Google OAuth Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**
   - Enable the Google+ API
   - Enable the Google Search Console API
   - Enable the Web Search Indexing API

3. **Create OAuth 2.0 Credentials**
   - Go to "Credentials" in the Google Cloud Console
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set Application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback` (for development)
     - `https://yourdomain.com/api/auth/callback` (for production)

4. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

## Features Implemented

✅ **Google OAuth Authentication**
- Sign in with Google
- User profile display
- Secure session management

✅ **Protected Routes**
- Dashboard requires authentication
- Automatic redirect to login

✅ **User Interface**
- Login/logout buttons in navbar
- User avatar and dropdown menu
- Loading states

✅ **API Endpoints**
- `/api/auth/google` - Initiate OAuth flow
- `/api/auth/callback` - Handle OAuth callback
- `/api/auth/me` - Get current user info
- `/api/auth/logout` - Sign out user

## Usage

1. Start the development server: `npm run dev`
2. Click "Sign In with Google" in the navbar
3. Complete the Google OAuth flow
4. Access the dashboard at `/dashboard`

## Next Steps

- Integrate with Google Search Console API
- Add real site data fetching
- Implement indexing request functionality
- Add user preferences and settings