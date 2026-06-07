import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={24} color="#111" />
      </View>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="addvisitor"
          options={{
            title: "Add Visitor",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 10,
  },
});
