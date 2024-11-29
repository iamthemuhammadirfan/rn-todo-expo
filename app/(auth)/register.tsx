import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../context/auth";
import { styles } from "../../styles";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!username || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }

      await register(username, password);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.toString());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Create Account</Text>
          <Text style={styles.loginSubtitle}>Sign up to get started</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.loginButton, styles.registerButton]}
              onPress={handleRegister}
            >
              <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
