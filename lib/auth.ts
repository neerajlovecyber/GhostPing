import { parse } from 'cookie';
import { OAuth2Client } from 'google-auth-library';
import { getGoogleOAuthClient } from './google';

export interface User {
  email: string;
  name: string;
  picture?: string;
}

export async function getUser(req: Request): Promise<User | null> {
  try {
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies['google_token'];
    
    if (!token) {
      return null;
    }

    const oauth2Client = getGoogleOAuthClient();
    oauth2Client.setCredentials(JSON.parse(token));

    // Get user info from Google
    const oauth2 = new OAuth2Client();
    const ticket = await oauth2.verifyIdToken({
      idToken: JSON.parse(token).id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return null;
    }

    return {
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export function isAuthenticated(req: Request): boolean {
  const cookies = parse(req.headers.get('cookie') || '');
  return !!cookies['google_token'];
}