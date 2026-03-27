import * as Google from 'expo-auth-session/providers/google';
import {makeRedirectUri} from 'expo-auth-session';
import { useEffect } from 'react';

export default function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '696867146373-01u2hr7io7qv3uehfu7krcobcbhtcob1.apps.googleusercontent.com',
        iosClientId: '696867146373-r20qb1a55su6tbqs35mlos8s3dst657a.apps.googleusercontent.com',
        redirectUri: makeRedirectUri()
    });

    useEffect(() => {
        if (response && response.type === 'success') {
            console.log(response.authentication?.idToken)
        }
    }, [response]);

    return promptAsync;
}
