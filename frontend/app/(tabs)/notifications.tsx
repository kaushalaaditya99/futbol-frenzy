import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationRow from "@/components/NotificationsRow";
import { Notification } from "@/components/NotificationsRow";
import { useState } from "react";


const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "Drill Graded!",
        description: "You scored 8/10 on Cone Dribbling. Tape to see feedback",
        timestamp: new Date(),
        read: false,
        icon: "graded",
        iconBackground: "#c3f7c8"
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
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
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
]

function formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor (diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays <= 2) return `${diffDays} days ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); 
}

function getDateGroup(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today.getTime() - dateDay.getTime()) / 86400000);

    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "YESTERDAY";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

export default function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications);

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    // Group notifications by day label
    const groups: { [key: string]: Notification[] } = {};
    for (const n of notifications) {
        const label = getDateGroup(n.timestamp);
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
            }}>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>Notifications</Text>
                <Pressable onPress={markAllRead}>
                    <Text style={{ fontSize: 15, color: "#007AFF" }}>Mark all read</Text>
                </Pressable>
            </View>

            {/* Notification list */}
            <ScrollView>
                {Object.entries(groups).map(([label, items]) => (
                    <View key={label}>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: "gray",
                            paddingHorizontal: 20,
                            paddingTop: 16,
                            paddingBottom: 4,
                        }}>
                            {label}
                        </Text>

                        {items.map((item, index) => (
                            <View key={item.id}>
                                <NotificationRow notification={item} />
                                {index < items.length - 1 && (
                                    <View style={{
                                        height: 1,
                                        backgroundColor: "#F0F0F0",
                                        marginLeft: 76,
                                    }} />
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
