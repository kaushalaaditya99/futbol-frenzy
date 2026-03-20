import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Role = "Coach" | "Student" | null;

interface AuthContextType {
    token: string | null;
    role: Role;
    loaded: boolean;
    setAuth: (token: string, role: Role) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadAuth = async () => {
            const savedToken = await AsyncStorage.getItem("authToken");
            const savedRoleString = await AsyncStorage.getItem("userRole");
            let savedRole: Role = null;
            if (savedRoleString === "Coach" || savedRoleString === "Student") {
                savedRole = savedRoleString;
            } else if (savedRoleString !== null) {
                await AsyncStorage.removeItem("userRole");
            }
            if (savedToken) {
                setToken(savedToken);
                setRole(savedRole);
            }
            setLoaded(true);
        };
        loadAuth();
    }, []);

    function setAuth(newToken: string, newRole: Role) {
        setToken(newToken);
        setRole(newRole);
        AsyncStorage.setItem("authToken", newToken).catch((e) =>
            console.error("Failed to persist authToken:", e)
        );
        if (newRole !== null) {
            AsyncStorage.setItem("userRole", newRole).catch((e) =>
                console.error("Failed to persist userRole:", e)
            );
        } else {
            AsyncStorage.removeItem("userRole").catch((e) =>
                console.error("Failed to remove userRole:", e)
            );
        }
    }

    async function logout() {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userRole");
        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ token, role, loaded, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
