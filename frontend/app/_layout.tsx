import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
    <AuthProvider>
    <ProfileProvider>
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
      <Stack.Screen
          name="submissions/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="classes/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="assignments/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="gradeSubmission/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="drills/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="workouts/[id]"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="edit-profile"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
      <Stack.Screen
          name="change-password"
          options={{
            headerTitle: "",
            headerShown: false
          }}
      />
    </Stack>
    </ProfileProvider>
    </AuthProvider>
    </GestureHandlerRootView>
  );
}
