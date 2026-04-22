import { Pressable, View, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationRow, { Notification } from "@/components/NotificationsRow";
import { useNotifications } from "@/contexts/NotificationsContext";
import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import Header from "@/components/ui/user/Header";

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
    const sideBar = useSideBar();
    const { notifications, markRead, markAllRead, clearAll } = useNotifications();

    // Group notifications by day label
    const groups: { [key: string]: Notification[] } = {};
    for (const n of notifications) {
        const label = getDateGroup(n.timestamp);
        if (!groups[label]) groups[label] = [];
        groups[label].push(n);
    }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "black"
                }}
            >
                <SideBar
                    targetWidth={sideBar.sideBarTargetWidth}
                    animatedExpandFromLeft={sideBar.animatedExpandFromLeft}
                />
                <SafeAreaView 
                    edges={["top"]}
                    style={{
                        flex: 1,
                        width: Dimensions.get('window').width,
                        minWidth: Dimensions.get('window').width,
                        backgroundColor: colors.schemes.light.background,
                        position: "relative"
                    }}
                >
                    {sideBar.showSideBar &&
                        <SideBarDim
                            setShowSideBar={sideBar.setShowSideBar}
                        />
                    }
                    {/* Header */}
                    <Header
                        openSideBar={() => sideBar.setShowSideBar(true)}
                    />
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        paddingHorizontal: padding.lg,
                        paddingVertical: padding.lg,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.schemes.light.outlineVariant,
                    }}>
                        {/* <ThemedText style={{
                            fontSize: fontSize.lg,
                            fontWeight: "500",
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onBackground,
                        }}>
                            Notifications
                        </ThemedText> */}
                        <View style={{ flexDirection: "row", columnGap: padding.lg }}>
                            <Pressable 
                                onPress={markAllRead}
                                style={{
                                    padding: 8,
                                    paddingHorizontal: 16,
                                    borderRadius: borderRadius.base,
                                    backgroundColor: '#c6deff'
                                }}
                            >
                                <ThemedText style={{
                                    fontSize: fontSize.md,
                                    fontWeight: "500",
                                    color: colors.coreColors.primary,
                                }}>
                                    Mark All Read
                                </ThemedText>
                            </Pressable>
                            <Pressable 
                                onPress={clearAll}
                                style={{
                                    padding: 8,
                                    paddingHorizontal: 16,
                                    borderRadius: borderRadius.base,
                                    backgroundColor: '#ffc6c6'
                                }}
                            >
                                <ThemedText style={{
                                    fontSize: fontSize.md,
                                    fontWeight: "500",
                                    color: "#D32F2F",
                                }}>
                                    Clear All
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                    {/* Notification list */}
                    <ScrollView>
                        {Object.entries(groups).map(([label, items], i) => (
                            <View 
                                key={label}
                                style={{
                                    // backgroundColor: 'red'
                                }}
                            >
                                <ThemedText style={{
                                    fontSize: fontSize.xs,
                                    fontWeight: "700",
                                    color: colors.schemes.light.outline,
                                    textTransform: "uppercase",
                                    letterSpacing: letterSpacing["2xl"],
                                    paddingHorizontal: margin.sm,
                                    // paddingTop: padding.xl,
                                    paddingVertical: padding.xl,
                                    borderBottomWidth: 1,
                                    borderTopWidth: i === 0 ? 0 : 1,
                                    borderStyle: 'dashed',
                                    borderColor: colors.schemes.light.outlineVariant
                                    // backgroundColor: 'blue'
                                }}>
                                    {label}
                                </ThemedText>

                                {items.map((item, index) => (
                                    <View key={item.id}>
                                        <NotificationRow notification={item} onPress={() => markRead(item.id)} />
                                        {index < items.length - 1 && (
                                            <View style={{
                                                height: 1,
                                                borderBottomWidth: 1,
                                                borderStyle: 'dashed',
                                                borderColor: colors.schemes.light.outlineVariant,
                                                // backgroundColor: colors.schemes.light.outlineVariant,
                                                marginLeft: 68,
                                            }} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
}