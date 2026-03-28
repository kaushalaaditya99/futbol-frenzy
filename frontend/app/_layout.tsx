import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
