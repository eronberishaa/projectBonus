import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showErr = (msg) => setError(msg);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return showErr("Shkruaj një email të vlefshëm.");
    if (password.length < 6)
      return showErr("Fjalëkalimi duhet të ketë të paktën 6 karaktere.");
    if (password !== confirm)
      return showErr("Fjalëkalimet nuk përputhen.");

    return true;
  };

  const handleRegister = async () => {
    setError("");

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered:", user.user.email);

      router.replace("/");
    } catch (err) {
      console.error("Register Error:", err);
      showErr(err.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Krijo Llogari</Text>
      <Text style={styles.subtitle}>Plotëso të dhënat për të vazhduar</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Fjalëkalimi"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Konfirmo fjalëkalimin"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Regjistrohu</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Ke tashmë llogari? Kyçu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
  },

  errorBox: {
    width: "90%",
    backgroundColor: "#ffe5e5",
    borderColor: "#ff4d4d",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  errorText: {
    color: "#cc0000",
    fontWeight: "600",
    textAlign: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 22,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  input: {
    width: "100%",
    backgroundColor: "#f2f3f5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#222",
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  link: {
    marginTop: 25,
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
  },
});
