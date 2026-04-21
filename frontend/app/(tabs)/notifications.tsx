import { Pressable, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationRow, { Notification } from "@/components/NotificationsRow";
import { useNotifications } from "@/contexts/NotificationsContext";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";

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
    const { notifications, markRead, markAllRead, clearAll } = useNotifications();

    // Group notifications by day label
    const groups: { [key: string]: Notification[] } = {};
    for (const n of notifications) {
        const label = getDateGroup(n.timestamp);
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
            {/* Header */}
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: margin.sm,
                paddingVertical: padding.xl,
                borderBottomWidth: 1,
                borderBottomColor: colors.schemes.light.outlineVariant,
            }}>
                <ThemedText style={{
                    fontSize: fontSize.lg,
                    fontWeight: "500",
                    letterSpacing: letterSpacing.xs,
                    color: colors.schemes.light.onBackground,
                }}>
                    Notifications
                </ThemedText>
                <View style={{ flexDirection: "row", columnGap: padding.lg }}>
                    <Pressable onPress={markAllRead}>
                        <ThemedText style={{
                            fontSize: fontSize.md,
                            fontWeight: "500",
                            color: colors.coreColors.primary,
                        }}>
                            Mark all read
                        </ThemedText>
                    </Pressable>
                    <Pressable onPress={clearAll}>
                        <ThemedText style={{
                            fontSize: fontSize.md,
                            fontWeight: "500",
                            color: "#D32F2F",
                        }}>
                            Clear all
                        </ThemedText>
                    </Pressable>
                </View>
            </View>

            {/* Notification list */}
            <ScrollView>
                {Object.entries(groups).map(([label, items]) => (
                    <View key={label}>
                        <ThemedText style={{
                            fontSize: fontSize.xs,
                            fontWeight: "700",
                            color: colors.schemes.light.outline,
                            textTransform: "uppercase",
                            letterSpacing: letterSpacing["2xl"],
                            paddingHorizontal: margin.sm,
                            paddingTop: padding.xl,
                            paddingBottom: padding.sm,
                        }}>
                            {label}
                        </ThemedText>

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