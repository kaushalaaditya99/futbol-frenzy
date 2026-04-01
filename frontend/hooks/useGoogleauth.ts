import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'
import resolveEndpoint from '@/services/resolveEndpoint';

WebBrowser.maybeCompleteAuthSession();

const API_URL = resolveEndpoint("/api/");

export default function useGoogleAuth() {
    const { setAuth } = useAuth();
    const redirectUri = 'com.googleusercontent.apps.696867146373-r20qb1a55su6tbqs35mlos8s3dst657a:/oauth2redirect/google';
    console.log('Redirect URI:', redirectUri);
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '696867146373-01u2hr7io7qv3uehfu7krcobcbhtcob1.apps.googleusercontent.com',
        iosClientId: '696867146373-r20qb1a55su6tbqs35mlos8s3dst657a.apps.googleusercontent.com',
        redirectUri,
    });

    useEffect(() => {
        console.log('Google auth response:', JSON.stringify(response));

        const handleGoogleAuth = async () => {
            try {
                const idToken = response?.type === 'success' ? response.authentication?.idToken : null;
                console.log('idToken received:', idToken ? 'yes' : 'no');
                console.log('Sending idToken to backend...');
                const backendResponse = await fetch(`${API_URL}google-auth/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
                const data = await backendResponse.json();
                console.log('Backend response:', JSON.stringify(data));
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
