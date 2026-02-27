import { Bell, ChevronDown, ChevronRight, Flame } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

export default function Home() {
    return (
        <>
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
                        // justifyContent: "space-between",
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
                                backgroundColor: "red",
                                borderRadius: 100,
                                position: "absolute",
                                bottom: 0,
                                right: 0
                            }}
                        />
                    </View>
                    <View
                        style={{
                            backgroundColor: "transparent"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: "white",
                                textAlign: "left"
                            }}
                        >
                            Good Morning,
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: "white",
                                textAlign: "left"
                            }}
                        >
                            Alex Rivera
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "white"
                    }}
                >
                    {/* Overview */}
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 24,
                            paddingHorizontal: 24,
                            borderBottomWidth: 1,
                            borderBottomColor: "black",
                            borderStyle: "solid"
                        }}
                    >
                        {/* Days Streak */}
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                borderRadius: 4,
                                paddingVertical: 6,
                                paddingHorizontal: 24
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    columnGap: 4
                                    
                                }}
                            >
                                <Flame
                                    size={12}
                                />
                                <Text>
                                    7
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 10,
                                    fontWeight: 500,
                                    color: "gray",
                                    textAlign: "center"
                                }}
                            >
                                DAY STREAK
                            </Text>
                        </View>
                        {/* This Week */}
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                borderRadius: 4,
                                paddingVertical: 6,
                                paddingHorizontal: 24
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                12
                            </Text>
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 10,
                                    fontWeight: 500,
                                    color: "gray",
                                }}
                            >
                                THIS WEEK
                            </Text>
                        </View>
                        {/* Due Today */}
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                borderRadius: 4,
                                paddingVertical: 6,
                                paddingHorizontal: 24
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                3
                            </Text>
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 10,
                                    fontWeight: 500,
                                    color: "gray",
                                }}
                            >
                                DUE TODAY
                            </Text>
                        </View>
                    </View>
                    {/* Schedule */}
                    <View
                        style={{
                            paddingVertical: 24,
                            paddingHorizontal: 24,
                            rowGap: 12
                        }}
                    >
                        {/* Header */}
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600
                                }}
                            >
                                Schedule
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
                                    borderRadius: 4
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12
                                    }}
                                >
                                    This Week
                                </Text>
                                <ChevronDown
                                    size={12}
                                    strokeWidth={2.5}
                                />
                            </View>
                        </View>
                        {/* Days */}
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                columnGap: 4
                            }}
                        >
                            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => (
                                <View
                                    key={i}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 2,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        borderStyle: "solid",
                                        borderRadius: 4,
                                        backgroundColor: day === "SUN" ? "black" : "white"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 400,
                                            textAlign: "center",
                                            color: day === "SUN" ? "white" : "black"
                                        }}
                                    >
                                        {day}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* Sessions */}
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 12
                            }}
                        >
                            {[
                                {
                                    name: "Cone Dribbling",
                                    type: "Ball Control",
                                    time: 5,
                                    class: "U12 Boys",
                                    isNew: true,
                                    isDue: false,
                                    imageBackgroundColor: "lightgreen",
                                    imageEmoji: "🏃‍♂️"
                                },
                                {
                                    name: "Wall Pass & Receive",
                                    type: "Passing",
                                    time: 8,
                                    class: "U12 Boys",
                                    isNew: true,
                                    isDue: false,
                                    imageBackgroundColor: "lightblue",
                                    imageEmoji: "⚽"
                                },
                                {
                                    name: "Shooting Accuracy",
                                    type: "Shooting",
                                    time: 10,
                                    class: "U12 Boys",
                                    isNew: false,
                                    isDue: true,
                                    imageBackgroundColor: "orange",
                                    imageEmoji: "🎯"
                                }
                            ].map((session, i) => (
                                <View
                                    key={i}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        paddingVertical: 8,
                                        paddingHorizontal: 8,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        borderStyle: "solid",
                                        borderRadius: 6,
                                        columnGap: 8
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 6,
                                            backgroundColor: session["imageBackgroundColor"],
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
                                            {session["imageEmoji"]}
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
                                                {session["name"]}
                                            </Text>
                                            {(session["isNew"] || session["isDue"]) &&
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        paddingVertical: 0,
                                                        paddingHorizontal: 8,
                                                        backgroundColor: session["isNew"] ? "lightgreen" : "pink",
                                                        borderRadius: 100
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: 600,
                                                            color: session["isNew"] ? "green" : "red",
                                                        }}
                                                    >
                                                        {session["isNew"] ? "NEW" : session["isDue"] ? "DUE" : ""}
                                                    </Text>
                                                </View>
                                            }
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
                                                {session["type"]}
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
                                                {session["time"]}
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
                                                {session["class"]}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
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
                                    alignItems: "center",
                                    columnGap: 4
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14
                                    }}
                                >
                                    View All
                                </Text>
                                <ChevronRight
                                    size={14}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Results */}
                    <View
                        style={{
                            paddingBottom: 24,
                            paddingHorizontal: 24,
                            rowGap: 12
                        }}
                    >
                        {/* Header */}
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600
                                }}
                            >
                                Results
                            </Text>
                        </View>
                        <View
                            style={{
                                rowGap: 12
                            }}
                        >
                            {
                                [
                                    {
                                        name: "Juggling Challenge",
                                        date: "Feb 12",
                                        type: "Ball Control",
                                        score: 9,
                                        imageBackgroundColor: "lightgreen",
                                        imageColor: "green"
                                    },
                                    {
                                        name: "First Touch Control",
                                        date: "Feb 10",
                                        type: "Receiving",
                                        score: 6,
                                        imageBackgroundColor: "lightblue",
                                        imageColor: "blue"
                                    }
                                ].map((result, i) => (
                                    <View
                                        key={i}
                                        style={{    
                                            display: "flex",
                                            flexDirection: "row",
                                            paddingVertical: 8,
                                            paddingHorizontal: 8,
                                            borderWidth: 1,
                                            borderColor: "black",
                                            borderStyle: "solid",
                                            borderRadius: 6,
                                            columnGap: 8
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 100,
                                                backgroundColor: result["imageBackgroundColor"],
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 24,
                                                    fontWeight: 600,
                                                    color: result["imageColor"]
                                                }}
                                            >
                                                {result["score"]}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                rowGap: 2
                                            }}
                                        >
                                            <Text>
                                                {result["name"]}
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
                                                        color: "gray"
                                                    }}
                                                >
                                                    {result["date"]}
                                                </Text>
                                                <View
                                                    style={{
                                                        backgroundColor: "gray",
                                                        width: 3,
                                                        height: 3,
                                                        borderRadius: 1000
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: "gray"
                                                    }}
                                                >
                                                    {result["type"]}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
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
                                    alignItems: "center",
                                    columnGap: 4
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14
                                    }}
                                >
                                    View All
                                </Text>
                                <ChevronRight
                                    size={14}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}