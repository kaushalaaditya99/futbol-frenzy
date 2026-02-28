import ThemedText from '@/components/ThemedText';
import { colors } from '@/theme';
import { Tabs } from 'expo-router';
import { Bell, Calendar, ClipboardList, Cog, Home, Zap } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

const ICON_SIZE = 20;

export default function Layout() {
    const [numNotifications, setNumNotifications] = useState(3);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarLabelStyle: { 
                    fontSize: 12
                },
                tabBarStyle: {
                    borderTopWidth: 0,
                    backgroundColor: "black",
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
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: focused ? "600" : "500",
                                color: color
                            }}
                        >
                            Home
                        </Text>
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
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: focused ? "600" : "500",
                                color: color
                            }}
                        >
                            Classes
                        </Text>
                    )
                }} 
            />
            <Tabs.Screen 
                name="drills"
                options={{ 
                    title: "Drills",
                    tabBarIcon: ({color, size }) => (
                        <Zap
                            size={ICON_SIZE}
                            color={color}
                        />
                    ),
                    tabBarLabel: ({color, focused}) => (
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: focused ? "600" : "500",
                                color: color
                            }}
                        >
                            Drills
                        </Text>
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
                                {numNotifications !== 0 &&
                                    <ThemedText
                                        style={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: colors.schemes.light.onPrimary
                                        }}
                                    >
                                        {numNotifications}
                                    </ThemedText>
                                }
                            </View>
                        </View>
                    ),
                    tabBarLabel: ({color, focused}) => (
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: focused ? "600" : "500",
                                color: color
                            }}
                        >
                            Notifications
                        </Text>
                    )
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
                    href: null,
                }}
            />
    </Tabs>
  );
}