import { View, Pressable } from "react-native";
import { CircleCheck, Calendar1, MessageCircleMore, AlarmClock } from "lucide-react-native";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, margin, padding } from "@/theme";

export interface Notification {
    id: string;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
    icon: string;
    iconBackground: string;
}

export default function NotificationItem({ notification, onPress }: { notification: Notification; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: margin.sm,
                paddingVertical: padding.xl,
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
                    marginRight: padding.lg,
                }}
            >
                <View>
                    {notification.icon === "graded"   && <CircleCheck        size={25} color={colors.coreColors.tertiary} />}
                    {notification.icon === "session"  && <Calendar1          size={22} color={colors.coreColors.primary} />}
                    {notification.icon === "chat"     && <MessageCircleMore  size={22} color={colors.schemes.light.onSurfaceVariant} />}
                    {notification.icon === "reminder" && <AlarmClock         size={22} color="#FF9800" />}
                </View>
            </View>

            {/* Text content */}
            <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: "700", fontSize: fontSize.md, color: colors.schemes.light.onSurface }}>
                    {notification.title}
                </ThemedText>
                <ThemedText style={{ fontSize: fontSize.md, color: colors.schemes.light.onSurfaceVariant, marginTop: padding.xs }}>
                    {notification.description}
                </ThemedText>
            </View>

            {/* Unread blue dot */}
            {!notification.read && (
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.coreColors.primary,
                        marginLeft: padding.md,
                    }}
                />
            )}
        </Pressable>
    );
}
