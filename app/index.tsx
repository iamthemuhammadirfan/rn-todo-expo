import { Redirect } from "expo-router";
import { useAuth } from "../context/auth";
import { View, ActivityIndicator } from "react-native";
import { styles } from "../styles";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/home" />;
}
