
// Code used: https://github.com/colinhacks/next-firebase-ssr/blob/master

import React, { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import { firebase } from "./firebaseClient";

const AuthContext = createContext({
    user: null,
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    if (typeof window !== "undefined") {
        window.nookies = nookies;
    }

    useEffect(() => {
        return firebase.auth().onIdTokenChanged(async (user) => {
            if (!user) {
                setUser(null);
                nookies.destroy(null, "token");
                nookies.set(null, "token", "", {path: '/'});
                return;
            }

            const token = await user.getIdToken();
            setUser(user);
            nookies.destroy(null, "token");
            nookies.set(null, "token", token, {path: '/'});
        });
    }, []);

    // force refresh the token every 10 minutes
    useEffect(() => {
        const handle = setInterval(async () => {
            await refreshToken()
        }, 10 * 60 * 1000);
        return () => clearInterval(handle);
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export const refreshToken = async () => {
    const user = firebase.auth().currentUser;
    if (user) return user.getIdToken(true);
}