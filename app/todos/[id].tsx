import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import api from "../../config/API";
import { styles } from "../../styles";

export default function TodoDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const fetchTodo = async () => {
    try {
      const response = await api.get(`/todos/${id}`);
      const todoData = response.data;
      setTodo(todoData);
      setTitle(todoData.title);
      setDescription(todoData.description || "");
      setCompleted(todoData.completed);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch todo details");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/todos/${id}`, {
        title: title.trim(),
        description: description.trim(),
        completed,
      });
      Alert.alert("Success", "Todo updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update todo"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/todos/${id}`);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete todo");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.detailContainer}
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

        <View style={styles.completedContainer}>
          <Text style={styles.label}>Mark as completed</Text>
          <Switch
            value={completed}
            onValueChange={setCompleted}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={completed ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.updateButton, isSaving && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? "Updating..." : "Update Todo"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButtonUpd}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonTextUpd}>Delete Todo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
