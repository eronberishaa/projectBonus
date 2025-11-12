import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from "react-native";
import {
    onAuthStateChanged,
    GithubAuthProvider,
    linkWithPopup,
    fetchSignInMethodsForEmail,
    signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { router } from "expo-router";

export default function Index() {
    const [user, setUser] = useState(null);
    const [linkedGit, setLinkedGit] = useState(false);
    const [error, setError] = useState("");

    const showErr = (msg) => setError(msg);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) return router.replace("/login");

            setUser(u);
            const providers = u.providerData.map((p) => p.providerId);
            setLinkedGit(providers.includes("github.com"));
        });

        return unsub;
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    // Link GitHub
    const handleLinkGitHub = async () => {
        setError("");

        try {
            const provider = new GithubAuthProvider();
            provider.addScope("user:email");

            const email = user.email.toLowerCase();
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.includes("github.com")) {
                return setLinkedGit(true);
            }

            const result = await linkWithPopup(auth.currentUser, provider);

            const newProviders = result.user.providerData.map((p) => p.providerId);
            setLinkedGit(newProviders.includes("github.com"));

        } catch (err) {
            console.log("Link GitHub Error:", err);
            showErr(err.message);
        }
    };

    if (!user)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mirë se vini 👋</Text>
            <Text style={styles.email}>{user.email}</Text>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {linkedGit ? (
                <Text style={styles.success}>GitHub është i lidhur!</Text>
            ) : (
                <TouchableOpacity style={styles.gitBtn} onPress={handleLinkGitHub}>
                    <Text style={styles.gitText}>Lidhe GitHub</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Dil</Text>
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
        backgroundColor: "white",
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
    },

    email: {
        fontSize: 18,
        color: "#007AFF",
        marginVertical: 15,
    },

    errorBox: {
        width: "80%",
        backgroundColor: "#ffdddd",
        borderWidth: 1,
        borderColor: "#ff4444",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },

    errorText: {
        color: "#cc0000",
        textAlign: "center",
        fontWeight: "bold",
    },

    success: {
        fontSize: 18,
        color: "green",
        fontWeight: "bold",
        marginBottom: 25,
    },

    gitBtn: {
        backgroundColor: "#333",
        padding: 12,
        width: "75%",
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },

    gitText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

    logoutBtn: {
        backgroundColor: "#DB4437",
        padding: 12,
        width: "75%",
        borderRadius: 10,
        alignItems: "center",
    },

    logoutText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
