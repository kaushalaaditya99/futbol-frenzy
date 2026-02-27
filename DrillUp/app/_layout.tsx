import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerTitle: ""
        }}  
      />
      <Stack.Screen 
        name="resetPassword"
        options={{
          headerTitle: ""
        }}  
      />
      <Stack.Screen 
        name="createAccount"
        options={{
          headerTitle: ""
        }}
      />
    </Stack>
  );
}
