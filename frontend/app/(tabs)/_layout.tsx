import ThemedText from '@/components/ui/ThemedText';
import { colors, fontSize, letterSpacing } from '@/theme';
import { NotificationsProvider, useNotifications } from '@/contexts/NotificationsContext';
import { Tabs } from 'expo-router';
import { Bell, Calendar, ClipboardList, Cog, Home, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

const ICON_SIZE = 20;

function TabsLayout() {
    const { unreadCount } = useNotifications();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 12
                },
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.surface,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({color, size }) => (
                        <Home
                            size={ICON_SIZE}
                            color={color}
                        />
                    ),
                    tabBarLabel: ({color, focused}) => (
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                letterSpacing: letterSpacing.lg,
                                fontWeight: 500,
                                color: color
                            }}
                        >
                            Home
                        </ThemedText>
                    )
                }}
            />
            <Tabs.Screen
                name="classes"
                options={{
                    title: "Classes",
                    tabBarIcon: ({color, size }) => (
                        <ClipboardList
                            size={ICON_SIZE}
                            color={color}
                        />
                    ),
                    tabBarLabel: ({color, focused}) => (
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                letterSpacing: letterSpacing.lg,
                                fontWeight: 500,
                                color: color
                            }}
                        >
                            Classes
                        </ThemedText>
                    )
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                    tabBarIcon: ({color, size }) => (
                        <View
                            style={{
                                position: "relative"
                            }}
                        >
                            <Bell
                                size={ICON_SIZE}
                                color={color}
                            />
                            {unreadCount !== 0 &&
                                <View
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: 14,
                                        height: 14,
                                        position: "absolute",
                                        top: -5,
                                        left: 9,
                                        backgroundColor: colors.coreColors.primary,
                                        borderRadius: 100
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: colors.schemes.light.onPrimary
                                        }}
                                    >
                                        {unreadCount}
                                    </ThemedText>
                                </View>
                            }
                        </View>
                    ),
                    tabBarLabel: ({color, focused}) => (
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                letterSpacing: letterSpacing.lg,
                                fontWeight: 500,
                                color: color
                            }}
                        >
                            Notifications
                        </ThemedText>
                    )
                }}
            />
            <Tabs.Screen
                name="drills"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="workouts"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="class"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="demonstration"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="edit-profile"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="change-password"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="all-submissions"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="drills/[id]"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
            <Tabs.Screen
                name="workouts/[id]"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />
          
        </Tabs>
  );
}

export default function Layout() {
    return (
        <NotificationsProvider>
            <TabsLayout />
        </NotificationsProvider>
    );
}
