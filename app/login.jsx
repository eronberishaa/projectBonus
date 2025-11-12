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

  useEffect(() => {
    (async () => {
      await signOut(auth).catch(() => { });
      setLoading(false);
    })();
  }, []);

  const showErr = (msg) => setError(msg);

  const handleEmailLogin = async () => {
    setError("");

    if (!email || !password)
      return showErr("Plotëso email-in dhe fjalëkalimin.");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (err) {
      console.log("Email error:", err);
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
          "Ky email është përdorur me Email/Password. Kyçu me email dhe lidhe GitHub nga brenda aplikacionit."
        );
      }

      router.replace("/");

    } catch (err) {
      console.log("GitHub login error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        return showErr("Popup u mbyll. Provo përsëri.");
      }

      showErr(err.message);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kyçu në BonusProject</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Fjalëkalimi"
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },

  errorBox: {
    width: "85%",
    backgroundColor: "#ffdddd",
    borderColor: "#ff4444",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },

  errorText: {
    color: "#cc0000",
    fontWeight: "bold",
    textAlign: "center",
  },

  input: {
    width: "85%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    width: "85%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },

  githubButton: {
    backgroundColor: "#333",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    color: "#007AFF",
    fontSize: 15,
  },
});
