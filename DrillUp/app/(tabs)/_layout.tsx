import { Tabs } from 'expo-router';
import { Bell, Calendar, ClipboardList, Cog, Home, Zap } from 'lucide-react-native';
import { Image, Text, View } from 'react-native';

const ICON_SIZE = 20;

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerTitle: "",
                headerLeft: () => (
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 6
                        }}
                    > 
                        <View
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 100,
                                backgroundColor: "black",
                                marginLeft: 8
                            }}
                        />
                        <View
                            style={{
                                backgroundColor: "transparent"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Good Morning
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Alex Rivera
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: 100,
                            backgroundColor: "none",
                            marginRight: 8,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        >
                            <Bell
                                size={20}
                                color="black"
                            />
                        </View>
                    </View>
                ),
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