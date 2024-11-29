import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Text } from "react-native";

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
      <Text style={{ color: "#FF3B30", fontSize: 16 }}>Logout</Text>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: "My Todos",
            headerRight: () => <LogoutButton />,
            headerBackVisible: false, // Hide back button
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />
        <Stack.Screen
          name="todos/[id]"
          options={{
            title: "Update Todo",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="todos/create"
          options={{
            title: "Create Todo",
            presentation: "modal",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
