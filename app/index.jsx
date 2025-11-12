import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
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

    const handleLinkGitHub = async () => {
        setError("");
        try {
            const provider = new GithubAuthProvider();
            provider.addScope("user:email");

            const email = user.email.toLowerCase();
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.includes("github.com")) {
                setLinkedGit(true);
                return;
            }

            const result = await linkWithPopup(auth.currentUser, provider);

            const newProviders = result.user.providerData.map((p) => p.providerId);
            setLinkedGit(newProviders.includes("github.com"));

        } catch (err) {
            showErr(err.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    if (!user)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Mirë se erdhe 👋</Text>
                <Text style={styles.email}>{user.email}</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {linkedGit ? (
                    <View style={styles.successBox}>
                        <Text style={styles.successText}>✔ GitHub është i lidhur!</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.githubButton} onPress={handleLinkGitHub}>
                        <Text style={styles.buttonText}>Lidhe GitHub</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Dil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    container: {
        flex: 1,
        backgroundColor: "#f7f8fa",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    card: {
        width: "90%",
        backgroundColor: "white",
        padding: 25,
        borderRadius: 20,

        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#222",
        marginBottom: 8,
    },

    email: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },

    errorBox: {
        backgroundColor: "#ffe5e5",
        borderRadius: 10,
        padding: 12,
        borderColor: "#ff4d4d",
        borderWidth: 1,
        marginBottom: 20,
    },

    errorText: {
        textAlign: "center",
        color: "#cc0000",
        fontWeight: "600",
    },

    successBox: {
        backgroundColor: "#e0ffe8",
        borderRadius: 10,
        padding: 12,
        borderColor: "#2ecc71",
        borderWidth: 1,
        marginBottom: 20,
    },

    successText: {
        textAlign: "center",
        color: "#2ecc71",
        fontWeight: "700",
    },

    githubButton: {
        backgroundColor: "#333",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },

    logoutButton: {
        backgroundColor: "#DB4437",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});
