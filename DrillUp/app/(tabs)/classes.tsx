import { router } from "expo-router";
import { ArrowDownUp, Plus, Search } from "lucide-react-native";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Classes() {
    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: "black"
            }}
        >
            <View
                style={{
                    backgroundColor: "black",
                    height: 12 * 6,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 24,
                    columnGap: 12
                }}
            >
                <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 100,
                        backgroundColor: "white",
                        position: "relative"
                    }}
                >
                    <View
                        style={{
                            width: 12,
                            height: 12,
                            backgroundColor: "transparent",
                            borderRadius: 100,
                            position: "absolute",
                            bottom: 0,
                            right: 0
                        }}
                    />
                </View>
            </View>
            <ScrollView
                style={{
                    backgroundColor: "white",
                    paddingVertical: 24,
                    paddingHorizontal: 24,
                    display: "flex",
                    rowGap: 24
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 600
                        }}
                    >
                        My Classes
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 4,
                            paddingVertical: 2,
                            paddingHorizontal: 8,
                            borderWidth: 1,
                            borderColor: "black",
                            borderStyle: "solid",
                            borderRadius: 4,
                            backgroundColor: "black"
                        }}
                    >
                        <Plus
                            size={16}
                            color="white"
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "white"
                            }}
                        >
                            Add Class
                        </Text>
                        
                    </View>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 24
                    }}
                >
                    <View
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRightWidth: 1,
                            borderColor: "black",
                            borderStyle: "solid"
                        }}
                    >
                        <Search
                            size={18}
                        />
                    </View>
                    <TextInput
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            color: "black",
                            
                        }}
                        placeholderTextColor="gray"
                        placeholder="Search Classes..."
                    />
                    <View
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderLeftWidth: 1,
                            borderColor: "black",
                            borderStyle: "solid"
                        }}
                    >
                        <ArrowDownUp
                            size={18}
                        />
                    </View>
                </View>
                <View>
                    {
                        [
                            {
                                name: "U12 Boys A-Team",
                                coach: "Martinez",
                                numStudents: 18,
                                imageEmoji: "⚽"
                            },
                            {
                                name: "Chelsea FC",
                                coach: "John",
                                numStudents: 18,
                                imageEmoji: "🏃"
                            }
                        ].map((group, i) => (
                            <Pressable
                                key={i}
                            >
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        paddingVertical: 8,
                                        paddingHorizontal: 8,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        borderStyle: "solid",
                                        borderRadius: 6,
                                        columnGap: 8,
                                        marginBottom: 12
                                    }}
                                    
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 6,
                                            backgroundColor: "lightgray",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 24
                                            }}
                                        >
                                            {group["imageEmoji"]}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            rowGap: 2
                                        }}
                                    >
                                        <View    
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Text>
                                                {group["name"]}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                columnGap: 8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: "gray"
                                                }}
                                            >
                                                Coach {group["coach"]}
                                            </Text>
                                            <View
                                                style={{
                                                    width: 3,
                                                    height: 3,
                                                    borderRadius: 100,
                                                    backgroundColor: "gray"
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: "gray"
                                                }}
                                            >
                                                {group["numStudents"]} students
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    }
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "dashed",
                        borderRadius: 8,
                        paddingHorizontal: 24,
                        paddingVertical: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 12
                    }}
                >
                    <Text
                        style={{
                            fontSize: 48,
                            marginBottom: 8
                        }}
                    >
                        📎
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 2
                        }}
                    >
                        Join a Class
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 8
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: "gray",
                                maxWidth: 200,
                                textAlign: "center"
                            }}
                        >
                            Enter a class code or scan a QR code from your coach
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}