import { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "@/components/NotificationsRow";

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

interface NotificationsContextType {
    notifications: Notification[];
    markRead: (id: string) => void;
    markAllRead: () => void;
    unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState(mockNotifications);

    function markRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider value={{ notifications, markRead, markAllRead, unreadCount }}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationsContext);
    if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
    return ctx;
}
