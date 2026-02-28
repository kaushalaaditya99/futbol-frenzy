import { Ellipsis, MoveLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function Class() {
    // Tabs
    const [currentTab, setCurrentTab] = useState("Overview");
    const tabs = ["Overview", "Calendar", "Sessions"];
    
    // Calendar
    const [selected, setSelected] = useState('');

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: "black"
            }}
        >
            {/* Header */}
            <View
                style={{
                    backgroundColor: "black",
                    height: 12 * 6,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 24,
                    columnGap: 12
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 12
                    }}
                >
                    <MoveLeft
                        size={24}
                        color="white"
                    />
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "white"
                        }}
                    >
                        U12 Boys A-Team
                    </Text>
                </View>
                <View
                    style={{
                        height: 24,
                        width: 24,
                        borderWidth: 1,
                        borderColor: "white",
                        borderStyle: "solid",
                        borderRadius: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Ellipsis
                        size={16}
                        color="white"
                    />
                </View>
            </View>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "white"
                }}
            >
                {/* Tabs */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 12,
                        borderBottomWidth: 1,
                        borderColor: "black",
                        borderStyle: "solid"
                    }}
                >
                    {tabs.map((tab, i) => (
                        <Pressable
                            key={i}
                            onPress={() => setCurrentTab(tab)}
                            style={{
                                flex: 1
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 16
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: 16,
                                        fontWeight: tab === currentTab ? "600" : "400"
                                    }}
                                >
                                    {tab}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
                {/* Overview */}
                {currentTab === "Overview" &&
                    <>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 24,
                                paddingHorizontal: 24,
                                paddingVertical: 24,
                            }}
                        >
                            {[
                                {
                                    k: "Avg. Score",
                                    v: 87
                                }, 
                                {
                                    k: "Rank",
                                    v: "#3"
                                }, 
                                {
                                    k: "Done",
                                    v: "8/12"
                                }
                            ].map((metric, i) => (
                                <View
                                    key={i}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        paddingHorizontal: 12,
                                        borderWidth: 1,
                                        borderColor: "black",
                                        borderStyle: "solid",
                                        borderRadius: 8
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: 600,
                                            textAlign: "center"
                                        }}
                                    >
                                        {metric["v"]}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                            color: "gray",
                                            textAlign: "center"
                                        }}
                                    >
                                        {metric["k"]}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                borderStyle: "solid",
                                marginHorizontal: 24,
                                borderRadius: 8
                            }}
                        >
                            <Calendar
                                style={{
                                    borderRadius: 8
                                }}
                                theme={{
                                    textDayFontWeight: '400',
                                    textMonthFontWeight: '600',
                                    textDayHeaderFontWeight: '600',
                                }}
                                onDayPress={day => {
                                    setSelected(day.dateString);
                                }}
                                markedDates={{
                                    [selected]: {
                                        selected: true, 
                                        disableTouchEvent: true, 
                                        selectedColor: 'orange'
                                    }
                                }}
                            />
                        </View>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "black",
                                borderRadius: 8,
                                marginTop: 24,
                                marginHorizontal: 24
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        textAlign: "center",
                                        marginVertical: 14
                                    }}
                                >
                                    Score History
                                </Text>
                            </View>
                            <LineChart
                                style={{
                                    borderRadius: 8
                                }}
                                data={{
                                    datasets: [{ 
                                        data: [1, 2, 5, 10, 3, 2, 7] 
                                    }],
                                    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                                }}
                                width={Dimensions.get('window').width - 50}
                                height={220}
                                chartConfig={{
                                    backgroundGradientTo: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                            />
                        </View>
                    </>
                    
                }
            </ScrollView>
        </SafeAreaView>
    )
}