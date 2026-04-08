import SimpleButton from "@/components/ui/button/SimpleButton";
import SimpleHalfWidthButton from "@/components/ui/button/SimpleHalfWidthButton";
import SimpleInlineButton from "@/components/ui/button/SimpleInlineButton";
import InputText from "@/components/ui/input/InputText";
import Separator from "@/components/ui/Separator";
import SeparatorText from "@/components/ui/SeparatorText";
import ThemedText from "@/components/ui/ThemedText";
import { fontSize, padding, theme } from "@/theme";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import resolveEndpoint from '@/services/resolveEndpoint';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import useGoogleAuth from '@/hooks/useGoogleauth';

const API_URL = resolveEndpoint("/api/");

export default function Index() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { setAuth, token, role, loaded } = useAuth();
	const promptGoogleAuth = useGoogleAuth();

	useEffect(() => {
		if (loaded && token) {
			if (role) {
				router.replace("/(tabs)");
			} else {
				router.replace("/selectRole");
			}
		}
	}, [loaded, token, role]);

  // returns "Coach", "Student", or null
  const determineUserType = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}users/me/`, {
        headers: { Authorization: `Token ${authToken}` },
      });
      if (!response.ok) {
        console.error(
          "Failed to fetch user:",
          response.status,
          response.statusText,
        );
        return null;
      }
      const data = await response.json();
      console.log("users/me response:", JSON.stringify(data));
      if (data.groups.includes("Coach")) return "Coach" as const;
      if (data.groups.includes("Student")) return "Student" as const;
      return null;
    } catch (error) {
      console.error("Error determining user type:", error);
      return null;
    }
  };

  // login
  const login = async () => {
    try {
      const response = await fetch(`${API_URL}api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        const role = await determineUserType(data.token);
        setAuth(data.token, role);
      } else {
        console.error("Login failed:", data);
        alert(`Login failed: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("Network/Login error:", error);
      alert("Login error! See console for details.");
    }
  };

	return (
  	<SafeAreaView
    	style={{
      		backgroundColor: theme.colors.schemes.light.background,
      		flex: 1,
    	}}
  	>
	<ScrollView
		contentContainerStyle={{
			flexGrow: 1,
			justifyContent: "center",
			alignItems: "center",
			rowGap: padding.xl,
			paddingVertical: 24,
			paddingHorizontal: 36,
		}}
		keyboardShouldPersistTaps="handled"
	>
    	<View
      		style={{
        		display: "flex",
        		alignItems: "center",
        		justifyContent: "center"
      		}}
    >
    		<View
        		style={{
          			width: 80,
          			height: 80,
          			backgroundColor: "black",
          			borderRadius: 100,
          			display: "flex",
          			alignItems: "center",
          			justifyContent: "center",
          			marginBottom: 24
        			}}
      		>
        		<ThemedText
          			style={{
           		 		fontSize: 60,
          			}}
        	>
          		⚽
        	</ThemedText>
      	</View>
      	<ThemedText
        	style={{
          		fontSize: 32,
          		fontWeight: "600",
          		textAlign: "center",
          		marginBottom: 4
        	}}
      	>
        	DrillUp
      	</ThemedText>
      	<ThemedText
        	style={{
          		fontSize: 16,
          		fontWeight: "400",
          		letterSpacing: theme.letterSpacing.lg,
          		textAlign: "center",
          		color: theme.colors.schemes.light.onSurfaceVariant
        	}}
      	>
        	Practice smarter. Play better.
      	</ThemedText>
    </View>
    <View
      	style={{
        	display: "flex",
        	rowGap: 12,
        	width: "100%"
      	}}
    >
      	{/* Username */}
      	<InputText
        	label="Username"
        	value={username}
        	onChangeText={setUsername}
      	/>

      	{/* Password */}
      	<View
        	style={{
          		display: "flex",
          		rowGap: theme.padding.sm,
        	}}
      	>
        	<InputText
          		label="Password"
          		value={password}
          		onChangeText={setPassword}
          		secureTextEntry={true}
        	/>
        	<ThemedText
          		style={{
            		color: theme.colors.schemes.light.onSurfaceVariant,
            		fontSize: 14,
            		fontWeight: "500",
            		letterSpacing: theme.letterSpacing.xl,
            		textAlign: "right"
          	}}
          	onPress={() => router.push("/resetPassword")}
        >
          Forgot Password?
        </ThemedText>
    </View>
    </View>
    <SimpleButton
        onPress={login}
        label="Log In"
    />
    <SeparatorText
      text="OR CONTINUE WITH"
    />
    <View
      	style={{
        	display: "flex",
        	rowGap: 12,
      	}}
    >
     	<View
        	style={{
          	display: "flex",
          	flex: 1,
          	flexDirection: "row",
          	columnGap: 12,
          	maxHeight: 44,
        	}}
      	>
        	<SimpleHalfWidthButton
          	label="Google"
			onPress={() => promptGoogleAuth()}
        	/>
        	<SimpleHalfWidthButton
          	label="Apple"
        	/>
      	</View>
      	<SimpleButton
        	label="Continue with Facebook"
      	/>
      	<Pressable
        	onPress={() => router.push("/createAccount")}
        	style={{
          	display: "flex",
          	flexDirection: "row",
          	columnGap: padding.sm
        }}
      	>
        	<ThemedText
          		style={{
            	fontSize: fontSize.md,
            	color: theme.colors.schemes.light.onSurfaceVariant,
            	letterSpacing: theme.letterSpacing.xl,
            	alignSelf: "flex-start"
          	}}
        >
          Don't have an account?
        </ThemedText>
        <ThemedText
          	style={{
            	fontSize: fontSize.md,
            	color: theme.colors.schemes.light.onSurfaceVariant,
            	fontWeight: "500",
            	letterSpacing: theme.letterSpacing.xl,
            	alignSelf: "flex-start"
          	}}
          	onPress={() => router.push("/createAccount")}
        >
          Sign Up
        </ThemedText>
      </Pressable>
    </View>
  </ScrollView>
  </SafeAreaView>
);
}
