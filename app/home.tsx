import { View, FlatList, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Todo } from "@/types/api";
import { useAuth } from "../context/auth";
import api from "../config/API";
import { styles } from "../styles";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

  const fetchTodos = async () => {
    if (!user) return; // Only fetch todos if user is authenticated
    setIsLoading(true);
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo: Todo) => todo._id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete todo");
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => router.push(`/todos/${item._id}`)}
      >
        <Text style={[styles.todoText, item.completed && styles.completed]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item._id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Link href="/todos/create" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Todo</Text>
        </TouchableOpacity>
      </Link>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshing={isLoading}
        onRefresh={fetchTodos}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {isLoading ? "Loading..." : "No todos yet. Create one!"}
          </Text>
        )}
      />
    </View>
  );
}
