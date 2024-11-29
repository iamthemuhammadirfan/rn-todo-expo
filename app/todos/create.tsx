import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../../config/API";
import { styles } from "../../styles";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/todos", {
        title: title.trim(),
        description: description.trim(),
        completed: false,
      });

      // Navigate back to the todo list
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create todo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.createTodoContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter todo title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.createButtonText}>
            {isLoading ? "Creating..." : "Create Todo"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
