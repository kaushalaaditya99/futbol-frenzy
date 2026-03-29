import AssignWorkout from "@/components/pages/workouts/AssignWorkout";
import BottomScreen from "@/components/ui/BottomScreen";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import InputCheckbox from "@/components/ui/input/InputCheckbox";
import ThemedText from "@/components/ui/ThemedText";
import { Class, getClasses } from "@/services/classes";
import { getSession, Session } from "@/services/sessions";
import { padding, shadow, theme } from "@/theme";
import { router } from "expo-router";
import { BookmarkIcon, CalendarIcon, PlusCircle, PlusCircleIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workout() {
    const [classes, setClasses] = useState<Array<Class>>([]);
    const [workout, setWorkout] = useState<Session>();
    const [drillIndex, setDrillIndex] = useState(0);
    const [showAssignWorkout, setShowAssignWorkout] = useState(false);

    useEffect(() => {
        loadWorkout();
        loadClasses();
    }, []);

    const loadWorkout = async () => {
        const workout = await getSession(0, 0);
        setWorkout(workout);
    }

    const loadClasses = async () => {
        const classes = await getClasses(0, "");
        setClasses(classes);
    }

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.surface,
            }}
        >
            {showAssignWorkout &&
                <AssignWorkout
                    classes={classes}
                    onClose={() => setShowAssignWorkout(false)}
                />
            }
            <HeaderWithBack
                header="Workout"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <View
                style={{
                    padding: theme.margin.sm,
                    rowGap: theme.padding.md,
                    borderBottomWidth: 1,
                    borderColor: theme.colors.schemes.light.outlineVariant,
                    backgroundColor: "white"
                }}
            >
                <View
                    style={{
                        rowGap: theme.padding.xs
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        FNAME LNAME
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <ThemedText
                            style={{
                                flexShrink: 1,
                                fontSize: 20,
                                fontWeight: 600,
                                letterSpacing: theme.letterSpacing.sm,
                            }}
                        >
                            {workout?.name}
                        </ThemedText>
                        <View
                            style={{
                                flexDirection: "row",
                                columnGap: theme.padding.lg
                            }}
                        >
                            <PlusCircleIcon
                                size={20}
                                onPress={() => setShowAssignWorkout(true)}
                                stroke={theme.colors.schemes.light.onSurfaceVariant}
                            />
                            <BookmarkIcon
                                size={20}
                                stroke={workout?.bookmarked ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                fill={workout?.bookmarked ? theme.colors.coreColors.primary : "transparent"}
                            />
                        </View>
                    </View>
                </View>
                <ThemedText
                    style={{
                        fontSize: theme.fontSize.base,
                        letterSpacing: theme.letterSpacing["2xl"],
                        lineHeight: 20,
                        color: theme.colors.schemes.light.onSurfaceVariant
                    }}
                >
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
                </ThemedText>
            </View>
            <View
                style={{
                    padding: theme.margin.sm,
                    rowGap: theme.margin.sm,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    {[...Array(workout?.drills.length || 0)].map((e, i) => (
                        <Pressable
                            key={i}
                            onPress={() => setDrillIndex(i)}
                            style={{
                                width: 48,
                                aspectRatio: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 1000,
                                borderWidth: 1,
                                // borderStyle: "dashed",
                                borderColor: drillIndex === i ? theme.colors.coreColors.primary : theme.colors.schemes.light.surfaceContainerHighest,
                                backgroundColor: drillIndex === i ? theme.colors.coreColors.primary : "white",
                                ...(drillIndex === i ? {} : shadow.sm)
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    color: drillIndex === i ? "white" : theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {i+1}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>
                <View
                    style={{
                        borderRadius: theme.borderRadius.base,
                        backgroundColor: "white",
                        ...theme.shadow.sm
                    }}
                >
                    {/* Video */}
                    {/* The video would go here, but I'm not goign to bother faking one. */}
                    <View
                        style={{
                            // flex: 1,
                            width: "100%",
                            // height: 100,
                            aspectRatio: 2,
                            borderWidth: 1,
                            borderBottomWidth: 0,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            borderTopLeftRadius: theme.borderRadius.base,
                            borderTopRightRadius: theme.borderRadius.base,
                            backgroundColor: theme.colors.schemes.light.surfaceContainerHigh
                        }}
                    >
                    </View>
                    <View
                        style={{
                            padding: 0,
                            // borderTopWidth: 0,
                            borderWidth: 1,
                            borderBottomLeftRadius: theme.borderRadius.base,
                            borderBottomRightRadius: theme.borderRadius.base,
                            borderColor: theme.colors.schemes.light.outlineVariant
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            {[workout?.drills[drillIndex].type, workout?.drills[drillIndex].level, `${workout?.drills[drillIndex].time} mins`].map((tag, i) => (
                                <View
                                    key={i}
                                    style={{
                                        paddingVertical: theme.padding.sm,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderLeftWidth: i !== 0 ? 1 : 0,
                                        borderBottomWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                        backgroundColor: theme.colors.schemes.light.surfaceContainerHigh
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 500,
                                            letterSpacing: theme.letterSpacing.xl * 2,
                                            textAlign: "center",
                                            color: theme.colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {tag?.toUpperCase()}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                        <View
                            style={{
                                padding: theme.padding.lg
                            }}
                        >
                            <ThemedText
                                style={{
                                    marginBottom: theme.padding.sm,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: theme.letterSpacing.xl,
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                FName LName
                            </ThemedText>
                            <ThemedText
                                style={{
                                    marginBottom: theme.padding.md,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    letterSpacing: theme.letterSpacing.xl
                                }}
                            >
                                {workout?.drills[drillIndex].name}
                            </ThemedText>
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    lineHeight: 20,
                                    letterSpacing: theme.letterSpacing.xl * 2,
                                    color: theme.colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {workout?.drills[drillIndex].instructions}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}