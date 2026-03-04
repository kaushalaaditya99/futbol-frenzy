import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
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
    </Stack>
  );
}
