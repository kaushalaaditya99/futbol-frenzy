import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification } from "@/components/NotificationsRow";
import { useAuth } from "@/contexts/AuthContext";
import resolveEndpoint from "@/services/resolveEndpoint";

// mock notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Drill Graded!",
        description: "You scored 8/10 on Cone Dribbling. Tap to see feedback",
        timestamp: new Date(),
        read: false,
        icon: "graded",
        iconBackground: "#c3f7c8",
    },
    {
        id: "2",
        title: "New Session Assigned",
        description: "Coach Martinez assigned Session #20 with 3 drills. Due Feb 25.",
        timestamp: new Date(Date.now() - 3 * 3600000),
        read: false,
        icon: "session",
        iconBackground: "#6db1ff",
    },
    {
        id: "3",
        title: "Coach Left a Comment",
        description: "Coach Martinez commented on your Wall Pass drill submission",
        timestamp: new Date(Date.now() - 24 * 3600000),
        read: true,
        icon: "chat",
        iconBackground: "#edf5ff",
    },
    {
        id: "4",
        title: "Session Due Tomorrow",
        description: "You have 2 incomplete drills in Session #19. Don't forget!",
        timestamp: new Date(Date.now() - 26 * 3600000),
        read: true,
        icon: "reminder",
        iconBackground: "#FFF3CD",
    },
];

const API_URL = resolveEndpoint("/api/");

interface NotificationsContextType {
    notifications: Notification[];
    markRead: (id: string) => void;
    markAllRead: () => void;
    clearAll: () => void;
    unreadCount: number;
    refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { token } = useAuth();

    const fetchNotifications = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}notifications/`, {
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            const formatted: Notification[] = data.map((item: any) => ({
                id: String(item.id),
                title: item.title,
                description: item.description, // flexible
                timestamp: new Date(item.created_at),
                read: item.read ?? item.seen,

                icon: item.icon,
                iconBackground: item.iconBackground,
            }));

            setNotifications(formatted);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const markRead = async (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );

        try {
            await fetch(`${API_URL}notifications/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ read: true }),
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        try {
            await Promise.all(
                notifications.map(n =>
                    fetch(`${API_URL}notifications/${n.id}/`, {
                        method: "PATCH",
                        headers: {
                            Authorization: `Token ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ read: true }),
                    })
                )
            );
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const clearAll = async () => {
        const ids = notifications.map(n => n.id);
        setNotifications([]);

        try {
            await Promise.all(
                ids.map(id =>
                    fetch(`${API_URL}notifications/${id}/`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    })
                )
            );
        } catch (error) {
            console.error("Error clearing notifications:", error);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                markRead,
                markAllRead,
                clearAll,
                unreadCount,
                refreshNotifications: fetchNotifications,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
    return ctx;
}

