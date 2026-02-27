import { Tabs } from 'expo-router';
import { Calendar, ClipboardList, Cog, Home, Zap } from 'lucide-react-native';
import { Text } from 'react-native';

const ICON_SIZE = 20;

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarLabelStyle: { 
                    fontSize: 12 
                }
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{ 
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
                name="sessions" 
                options={{ 
                    title: "Sessions",
                    tabBarIcon: ({color, size }) => (
                        <Calendar
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
                            Calendar
                        </Text>
                    )
                }} 
            />
            <Tabs.Screen 
                name="settings" 
                options={{ 
                    title: "Settings",
                    tabBarIcon: ({color, size }) => (
                        <Cog
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
                            Settings
                        </Text>
                    )
                }} 
            />
    </Tabs>
  );
}