import { Text, View } from "react-native";

export interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
    icon: string;
    iconBackground: string;
}

export default function NotificationItem({ notification }: { notification: Notification }) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 14,
            }}
        >
            {/* Icon circle */}
            <View
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: notification.iconBackground,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                }}
            >
                <Text style={{ fontSize: 20 }}>
                    {notification.icon === "graded" && "✅"}
                    {notification.icon === "session" && "📅"}
                    {notification.icon === "chat" && "💬"}
                    {notification.icon === "reminder" && "⏰"}
                </Text>
            </View>

            {/* Text content */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 15 }}>
                    {notification.title}
                </Text>
                <Text style={{ fontSize: 13, color: "gray", marginTop: 2 }}>
                    {notification.description}
                </Text>
            </View>

            {/* Unread blue dot */}
            {!notification.read && (
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#007AFF",
                        marginLeft: 8,
                    }}
                />
            )}
        </View>
    );
}
