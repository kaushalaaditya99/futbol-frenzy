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
            const savedRole = await AsyncStorage.getItem("userRole") as Role;
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
        AsyncStorage.setItem("authToken", newToken);
        if (newRole) AsyncStorage.setItem("userRole", newRole);
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
