import SimpleButton from "@/components/ui/button/SimpleButton";
import InputText from "@/components/ui/input/InputText";
import RadioCard from "@/components/ui/input/RadioCard";
import Separator from "@/components/ui/Separator";
import SeparatorText from "@/components/ui/SeparatorText";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, letterSpacing, margin, padding, theme } from "@/theme";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import resolveEndpoint from '@/services/resolveEndpoint';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGoogleAuth from "@/hooks/useGoogleauth";


const API_URL = resolveEndpoint("/api/");



export default function CreateAccount() {


    const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [group, setGroup] = useState('Coach');
    const promptGoogleAuth = useGoogleAuth();

	// login
  	const postAccount = async () =>
    {
        //check if password matches confirm_password field, return early if so
        if (password != password_confirm)
        {
            alert("Passwords don't match.")
            return;
        }

        try {
            const response = await fetch(`${API_URL}user/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email, first_name, last_name, group}),
        });

        const data = await response.json();

        if (response.ok) {
            //console.log('Login successful! Token:', data.token);
            alert('Account created successfully!');
            router.back();
        } else {
            // error on backend
            console.error('Account Creation failed:', data);
            alert(`Account creation failed: ${data.error || JSON.stringify(data)}`);
        }
        } catch (error) {
            // network error
            console.error('Network/Account Creation error:', error);
            alert('Account creation error! See console for details.');
        }
    }
    return (
        <ScrollView
            style={{
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <SafeAreaView
                style={{
                    rowGap: padding.xl,
                    paddingVertical: margin.lg,
                    paddingTop: margin.lg * 1.25,
                    paddingHorizontal: margin.lg,
                    flex: 1,
                }}
            >
                <View>
                    <ThemedText
                        style={{
                            fontSize: 32,
                            fontWeight: 600,
                            textAlign: "center",
                            marginBottom: 4
                        }}
                    >
                        Create Account
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            textAlign: "center",
                            letterSpacing: letterSpacing.lg,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Join DrillUp and level up your game.
                    </ThemedText>
                </View>
                <Separator/>
                <View
                    style={{
                        rowGap: 12
                    }}
                >
                    <SimpleButton
                        label="Sign Up with Google"
                        onPress={() => promptGoogleAuth()}
                    />
                    <SimpleButton
                        label="Sign Up with Apple"
                    />
                </View>
                <SeparatorText
                    text="OR WITH EMAIL"
                />
                <View
                    style={{
                        flex: 1,
                        rowGap: padding.lg
                    }}
                >
                    <InputText
                        label="First Name"
                        value={first_name}
        	            onChangeText={setFirstName}
                    />
                    <InputText
                        label="Last Name"
                        value={last_name}
        	            onChangeText={setLastName}
                    />
                    <InputText
                        label="Email Address"
                        value={email}
        	            onChangeText={setEmail}
                    />
                    <InputText
                        label="Username"
                        value={username}
        	            onChangeText={setUsername}
                    />
                    <InputText
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <InputText
                        label="Confirm Password"
                        value={password_confirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry={true}
                    />
                    <View
                        style={{
                            display: "flex",
                            flexShrink: 1,
                            minHeight: 100,
                            flexDirection: "row",
                            columnGap: padding.lg,
                        }}
                    >
                        <RadioCard
                            value="Coach"
                            selected =
                            {
                                group ==
                                "Coach"
                            }
                            onChange={value => setGroup(value)}
                            icon="🧑‍🏫"
                            label="Coach"
                            description="Create and assign drills"
                        />
                        <RadioCard
                            value="Student"
                            selected =
                            {
                                group ==
                                "Student"
                            }
                            onChange={value => setGroup(value)}
                            icon="⚽"
                            label="Player"
                            description="Practice and submit drills"
                        />
                    </View>
                    <View
                        style={{
                            display: "flex",
                            alignItems: "center",
                            rowGap: padding.md
                        }}
                    >
                        <SimpleButton
                            label="Create Account"
                            onPress={postAccount}
                        />
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: padding.sm
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md,
                                    letterSpacing: letterSpacing.lg,
                                    alignSelf: "flex-start",
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                Already have an account?
                            </ThemedText>
                            <ThemedText
                                onPress={() => router.push("/")}
                                style={{
                                    fontSize: fontSize.md,
                                    fontWeight: 600,
                                    letterSpacing: letterSpacing.lg,
                                    alignSelf: "flex-start",
                                    color: theme.colors.schemes.light.onSurface
                                }}
                            >
                                Log In
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}
