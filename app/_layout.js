import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
  screenOptions={{
  headerShown: false,

  tabBarActiveTintColor: "#6C63FF",
  tabBarInactiveTintColor: "#9ca3af",

  tabBarStyle: {
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 0,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 10,
  },

  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "600",
  },
}}
>
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* FAVORITOS */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* HISTORIAL */}
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />

      {/* PERFIL */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* OCULTAS */}
      <Tabs.Screen
        name="results"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="detail"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}