import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  signInWithEmailAndPassword,
  GithubAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const showErr = (msg) => setError(msg);

  useEffect(() => {
    (async () => {
      await signOut(auth).catch(() => { });
      setLoading(false);
    })();
  }, []);

  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) return showErr("Plotëso emailin dhe fjalëkalimin.");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (err) {
      showErr(err.message);
    }
  };

  const handleGitHubLogin = async () => {
    setError("");
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("user:email");

      const result = await signInWithPopup(auth, provider);
      const ghEmail = result.user.email?.toLowerCase();

      const methods = await fetchSignInMethodsForEmail(auth, ghEmail);

      if (methods.includes("password")) {
        await signOut(auth);
        return showErr(
          "Ky email përdoret me Email/Password. Kyçu me email dhe lidhe GitHub nga brenda."
        );
      }

      router.replace("/");

    } catch (err) {
      showErr(err.message);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BonusProject</Text>
      <Text style={styles.subtitle}>Mirësevini, kyçuni për të vazhduar</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
          <Text style={styles.buttonText}>Kyçu me Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.githubButton]}
          onPress={handleGitHubLogin}
        >
          <Text style={styles.buttonText}>Kyçu me GitHub</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Nuk ke llogari? Regjistrohu</Text>
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
    borderWidth: 1,
    borderColor: "#ff4d4d",
    padding: 12,
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
    padding: 20,
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

  githubButton: {
    backgroundColor: "#333",
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
