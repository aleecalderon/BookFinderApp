import * as SecureStore from 'expo-secure-store';

import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const PRIMARY = '#6C63FF';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError(
        'Completa todos los campos.'
      );
      return;
    }

    try {
      await SecureStore.setItemAsync(
        'userEmail',
        email
      );

      await SecureStore.setItemAsync(
        'session',
        'active'
      );

      router.replace('/profile');
    } catch (err) {
      console.log(err);

      setError(
        'Ocurrió un error al iniciar sesión.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <Stack.Screen
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: PRIMARY,
          },
          headerTintColor: '#fff',
        }}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          📚
        </Text>

        <Text style={styles.title}>
          Bienvenida
        </Text>

        <Text style={styles.subtitle}>
          Inicia sesión para guardar
          tus libros favoritos
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>
          📧 Correo
        </Text>

        <TextInput
          style={styles.input}
          placeholder="correo@gmail.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          🔒 Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? (
          <Text style={styles.error}>
            ⚠️ {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    justifyContent: 'center',
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
  },

  logo: {
    fontSize: 55,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#111827',
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 24,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  error: {
    color: '#DC2626',
    marginTop: 12,
    fontWeight: '600',
  },
});