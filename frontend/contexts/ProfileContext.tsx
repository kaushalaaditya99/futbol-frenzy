import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { loadExtendedProfile, ExtendedUser, defaultExtendedUser } from "@/services/extendeduser";

interface ProfileContextType {
    profile: ExtendedUser;
    refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { token, loaded, role } = useAuth();
    const [profile, setProfile] = useState<ExtendedUser>(defaultExtendedUser);

    const refreshProfile = async () => {
        if (!token) return;
        try {
            const data = await loadExtendedProfile(token);
            setProfile(data);
        } catch (err) {
            console.log("ProfileContext: failed to load profile", err);
        }
    };

    useEffect(() => {
        if (loaded && token && role) {
            refreshProfile();
        }
    }, [loaded, token, role]);

    return (
        <ProfileContext.Provider value={{ profile, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);
    if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
    return ctx;
}
