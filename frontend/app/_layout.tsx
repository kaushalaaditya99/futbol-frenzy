import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";

export default function RootLayout() {
  return (
    <AuthProvider>
    <ProfileProvider>
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="ui"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="createAccount"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="selectRole"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="demonstration"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="createClass"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="createDrill"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="drill"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="workout"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="createSession"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="assignSession"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="assignStudents"
        options={{
          headerTitle: "",
          headerShown: false
        }}
      />
    </Stack>
    </ProfileProvider>
    </AuthProvider>
  );
}
