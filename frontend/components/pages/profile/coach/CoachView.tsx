import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import ProfilePicture from "@/components/ui/user/ProfilePicture";
import { Class, deleteClass, getClasses } from "@/services/classes";
import { deleteDrill, Drillv2 as Drill, getDrills } from "@/services/drills";
import { deleteWorkout, getSessions, Session } from "@/services/sessions";
import { shadow, theme } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookTextIcon, DumbbellIcon, ZapIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { simpleGetUser, User } from "@/services/user";
import InlineRowCard from "./InlineRowCard";


export default function CoachView() {
    const router = useRouter();
    const { token } = useAuth();
    const [user, setUser] = useState<User>();

    const [tab, setTab] = useState("Your Classes");
    const [tabs] = useState(["Your Classes", "Your Drills", "Your Workouts"]);

    const [classes, setClasses] = useState<Class[]>([]);
    const [drills, setDrills] = useState<Drill[]>([]);
    const [workouts, setWorkouts] = useState<Session[]>([]);


    useEffect(() => {
        const load = async () => {
            if (!token) 
                return;
            
            setUser(await simpleGetUser(token))
            setClasses(await getClasses(token));
            setDrills(await getDrills());
            setWorkouts(await getSessions(token));
        }
        load();
    }, []);

    
    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.background,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "white"
                }}
            >
                <HeaderWithBack
                    header=""
                    onBack={() => router.back()}
                    containerStyle={{
                        paddingVertical: theme.margin.xs,
                        paddingHorizontal: theme.margin.xs,
                        backgroundColor: theme.colors.schemes.light.background,
                    }}
                />
                <View
                    style={{
                        padding: theme.margin.sm,
                        rowGap: theme.margin.sm,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                    }}
                >
                    <ProfilePicture
                        width={24*2.5}
                        height={24*2.5}
                    />
                    <View
                        style={{
                            rowGap: theme.padding.sm
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: theme.padding.md,
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: theme.fontSize["xl"],
                                    fontWeight: 600,
                                    letterSpacing: theme.letterSpacing["2xs"]
                                }}
                            >
                                {user?.first_name} {user?.last_name}
                            </ThemedText>
                            <View
                                style={{
                                    paddingVertical: theme.padding.sm,
                                    paddingHorizontal: theme.padding.md,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: theme.padding.md,
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                    backgroundColor: "white",
                                    ...shadow.sm
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: theme.fontSize["xs"],
                                        fontWeight: 600,
                                        letterSpacing: theme.letterSpacing["xl"],
                                        color: theme.colors.coreColors.primary
                                }}
                                >
                                    COACH
                                </ThemedText>
                                {/* <StarIcon
                                    size={8}
                                    color="orange"
                                    fill="orange"
                                /> */}
                            </View>
                        </View>
                        <ThemedText
                            style={{
                                fontSize: theme.fontSize["base"],
                                fontWeight: 400,
                                color: theme.colors.schemes.light.onSurfaceVariant,
                                letterSpacing: theme.letterSpacing["2xl"]
                            }}
                        >
                            {user?.email}
                        </ThemedText>
                    </View>
                </View>
                <View
                    style={{
                        height: 56,
                        paddingHorizontal: 8,
                        flexDirection: "row",
                        // justifyContent: "space-between",
                        // columnGap: theme.padding.md,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: "white"
                    }}
                >
                    {tabs.map((currTab, i) => (
                        <Pressable
                            key={i}
                            onPress={() => setTab(currTab)}
                            style={{
                                position: "relative",
                                flexDirection: "row",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: theme.padding.sm,
                            }}
                        >
                            {currTab === "Your Classes" &&
                                <BookTextIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            }
                            {currTab === "Your Drills" &&
                                <ZapIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            }
                            {currTab === "Your Workouts" &&
                                <DumbbellIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            }
                            <ThemedText
                                style={{
                                    paddingVertical: theme.padding.lg,
                                    fontSize: 15,
                                    fontWeight: currTab === tab ? 500 : 400,
                                    letterSpacing: theme.letterSpacing.xl * 2,
                                    color: currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                {currTab}
                            </ThemedText>
                            {currTab === tab &&
                                <View
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        bottom: -1,
                                        width: "100%",
                                        height: 1,
                                        borderRadius: 1000,
                                        backgroundColor: theme.colors.coreColors.primary
                                    }}
                                />
                            }
                        </Pressable>
                    ))}
                </View>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "white"
                    }}
                >
                    {tab === "Your Drills" &&
                        <View
                            style={{
                                flex: 1,
                                rowGap: theme.padding.md
                            }}
                        >
                            {drills.map((drill, i) => (
                                <View
                                    key={i}
                                >
                                    <InlineRowCard
                                        title={drill.drillName || ""}
                                        imageBackgroundColor={"lightgray"}
                                        imageTextColor={"black"}
                                        imageText={""}
                                        description={drill.instructions.length <= 70 ? drill.instructions : drill.instructions.slice(0, 70) + "..."}
                                        descriptions={[]}
                                        deleteObject={() => {
                                            if (!token)
                                                return;
                                            deleteDrill(token, drill.id);
                                            setDrills([...drills].filter(d => d.id != drill.id))
                                        }}
                                        onPress={() => 1}
                                        // onPress={() => router.push(`/drills/${drill.id}`)}
                                    />
                                </View>
                            ))}
                        </View>
                    }
                    {tab === "Your Workouts" &&
                        <View
                            style={{
                                flex: 1,
                                rowGap: theme.padding.md
                            }}
                        >
                            {workouts.map((workout, i) => (
                                <View
                                    key={i}
                                >
                                    <InlineRowCard
                                        title={workout.name || ""}
                                        imageBackgroundColor={workout.imageBackgroundColor || "lightgray"}
                                        imageTextColor={workout.imageTextColor || "black"}
                                        imageText={workout.imageText || ""}
                                        description={'I feel so bad, I\'ve got a worried mind. I\'m so lonesome all the time.'}
                                        descriptions={[]}
                                        deleteObject={() => {
                                            if (!token)
                                                return;
                                            deleteWorkout(token, workout.id);
                                            setWorkouts([...workouts].filter(w => w.id != workout.id))
                                        }}
                                        // onPress={() => 1}
                                        onPress={() => router.push(`/workouts/${workout.id}`)}
                                    />
                                </View>
                            ))}
                        </View>
                    }
                    {tab === "Your Classes" &&
                        <View
                            style={{
                                rowGap: theme.padding.md,
                            }}
                        >
                            {classes.map((class_, i) => (
                                <View
                                    key={i}
                                >
                                    <InlineRowCard
                                        title={class_.className || ""}
                                        imageBackgroundColor={class_.imageBackgroundColor || "lightgray"}
                                        imageTextColor={class_.imageTextColor || "black"}
                                        imageText={class_.imageText || ""}
                                        description={class_.description || 'ok'}
                                        descriptions={[
                                            `${class_.students?.length} students`
                                        ]}
                                        deleteObject={() => {
                                            if (!token)
                                                return;
                                            deleteClass(token, class_.id);
                                            setClasses([...classes].filter(cl => cl.id != class_.id))
                                        }}
                                        onPress={() => router.push(`/classes/${class_.id}`)}
                                    />
                                </View>
                            ))}
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}