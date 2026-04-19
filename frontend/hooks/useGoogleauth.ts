import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext'
import resolveEndpoint from '@/services/resolveEndpoint';

WebBrowser.maybeCompleteAuthSession();

const API_URL = resolveEndpoint("/api/");

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;

const IOS_REVERSED_ID = IOS_CLIENT_ID.replace('.apps.googleusercontent.com', '');
const ANDROID_REVERSED_ID = ANDROID_CLIENT_ID.replace('.apps.googleusercontent.com', '');

const redirectUri = Platform.select({
    ios: `com.googleusercontent.apps.${IOS_REVERSED_ID}:/oauth2redirect/google`,
    android: `com.googleusercontent.apps.${ANDROID_REVERSED_ID}:/oauth2redirect/google`,
}) as string;

export default function useGoogleAuth() {
    const { setAuth } = useAuth();
    // console.log('Redirect URI:', redirectUri);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        redirectUri,
    });

    useEffect(() => {
        // console.log('Google auth response:', JSON.stringify(response));

        const handleGoogleAuth = async () => {
            try {
                const idToken = response?.type === 'success' ? response.authentication?.idToken : null;
                // console.log('idToken received:', idToken ? 'yes' : 'no');
                // console.log('Sending idToken to backend...');
                const backendResponse = await fetch(`${API_URL}google-auth/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
                const data = await backendResponse.json();
                // console.log('Backend response:', JSON.stringify(data));
                if (backendResponse.ok && data.token) {
                    const role = data.groups?.includes('Coach') ? 'Coach' :
                                 data.groups?.includes('Student') ? 'Student' : null;
                    setAuth(data.token, role);
                }
            } catch (error) {
                console.error('Google auth error:', error);
            }
        };

        if (response?.type === 'success') {
            handleGoogleAuth();
        }
    }, [response]);

    return promptAsync;
}
