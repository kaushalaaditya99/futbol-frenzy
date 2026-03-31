import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationRow, { Notification } from "@/components/NotificationsRow";
import { useNotifications } from "@/contexts/NotificationsContext";
import { colors } from "@/theme";

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
    const { notifications, markRead, markAllRead } = useNotifications();

    // Group notifications by day label
    const groups: { [key: string]: Notification[] } = {};
    for (const n of notifications) {
        const label = getDateGroup(n.timestamp);
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.surface }}>
            {/* Header */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.schemes.light.outlineVariant,
            }}>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>Notifications</Text>
                <Pressable onPress={markAllRead}>
                    <Text style={{ fontSize: 15, color: colors.coreColors.primary }}>Mark all read</Text>
                </Pressable>
            </View>

            {/* Notification list */}
            <ScrollView>
                {Object.entries(groups).map(([label, items]) => (
                    <View key={label}>
                        <Text style={{
                            fontSize: 11,
                            fontWeight: "700",
                            color: colors.schemes.light.outline,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            paddingHorizontal: 20,
                            paddingTop: 16,
                            paddingBottom: 4,
                        }}>
                            {label}
                        </Text>

                        {items.map((item, index) => (
                            <View key={item.id}>
                                <NotificationRow notification={item} onPress={() => markRead(item.id)} />
                                {index < items.length - 1 && (
                                    <View style={{
                                        height: 1,
                                        backgroundColor: colors.schemes.light.outlineVariant,
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