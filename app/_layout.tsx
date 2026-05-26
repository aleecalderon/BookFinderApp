// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Declaramos nuestras tres pantallas principales */}
      <Stack.Screen name="index" options={{ title: "Buscador" }} />
      <Stack.Screen name="results" options={{ title: "Resultados JSON" }} />
      <Stack.Screen name="details" options={{ title: "Detalle del Libro" }} />
    </Stack>
  );
}
