import CreateDrillButton from "@/components/pages/drills/CreateDrillButton";
import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import CreateWorkoutButton from "@/components/pages/workouts/CreateWorkoutButton";
import FilterButton from "@/components/pages/workouts/FilterButton";
import useWorkoutSearch from "@/components/pages/workouts/useWorkoutSearch";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import SearchBar from "@/components/ui/SearchBar";
import ThemedText from "@/components/ui/ThemedText";
import Header from "@/components/ui/user/Header";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import { getSessions, Session } from "@/services/sessions";
import { shadow, spacing, theme } from "@/theme";
import { router } from "expo-router";
import { CheckIcon, FilterIcon } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SortButton from "@/components/pages/workouts/SortButton";
import WorkoutCardList from "@/components/pages/workouts/WorkoutCardList";
import BottomScreen from "@/components/ui/BottomScreen";
import { Slider } from '@miblanchard/react-native-slider';
import InputText from "@/components/ui/input/InputText";

export default function Workouts() {
    const { token } = useAuth();
    const sideBar = useSideBar();

    // Feed
    const [feed, setFeed] = useState("library");
    const feedOptions = [
        ["library", "My Library"], 
        ["explore", "Explore"], 
        ["bookmark", "Bookmarks"]
    ];

    // Workouts (Sessions)
    const [workouts, setWorkouts] = useState<Array<Session>>([]);
    const searchBar = useWorkoutSearch(workouts);

    // Filter
    const [showFilter, setShowFilter] = useState(false);
    const [range, setRange] = useState([0, 60]);
    const [type, setType] = useState<string[]>([]);
    const [types, setTypes] = useState([["shooting", "Shooting"], ["passing", "Passing"], ["conditioning", "Conditioning"]]);
    const [level, setLevel] = useState<string[]>([]);
    const [levels, setLevels] = useState([["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"]]);

    useEffect(() => {
        loadWorkouts();
    }, [token]);


    const loadWorkouts = async () => {
        if (!token) return;
        const workouts = await getSessions(token);
        setWorkouts(workouts);
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
                    backgroundColor: theme.colors.schemes.light.background,
                    position: "relative"
                }}
            >
                {sideBar.showSideBar &&
                    <SideBarDim
                        setShowSideBar={sideBar.setShowSideBar}
                    />
                }
                {showFilter &&
                    <BottomScreen
                        title="Filter Workouts"
                        onClose={() => setShowFilter(false)}
                    >
                        <View
                            style={{
                                // paddingVertical: theme.padding["2xl"],
                                // rowGap: theme.padding["2xl"],
                                borderTopWidth: 1,
                                borderColor: theme.colors.schemes.light.outlineVariant,
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: theme.padding["2xl"],
                                    rowGap: theme.padding.md,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: theme.fontSize.base,
                                        fontWeight: 500,
                                        letterSpacing: theme.letterSpacing.xl,
                                        color: theme.colors.schemes.light.onSurface
                                    }}
                                >
                                    Duration
                                </ThemedText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 50,
                                                paddingVertical: theme.padding.sm,
                                                paddingHorizontal: theme.padding.md,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderRightWidth: 0,
                                                borderColor: theme.colors.schemes.light.outlineVariant,
                                                borderTopLeftRadius: theme.borderRadius.sm,
                                                borderBottomLeftRadius: theme.borderRadius.sm,
                                                backgroundColor: theme.colors.schemes.light.surfaceContainerHighest,
                                                ...shadow.sm
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontWeight: 500,
                                                    letterSpacing: theme.letterSpacing.xl,
                                                    color: theme.colors.schemes.light.onSurfaceVariant
                                                }}
                                            >
                                                Min
                                            </ThemedText>
                                        </View>
                                        <InputText
                                            value={range[0] + ""}
                                            onChangeText={(text) => setRange([parseInt(text), range[1]])}
                                            wrapperStyle={{
                                                flexShrink: 1,
                                                // width: 100,
                                            }}
                                            inputStyle={{
                                                height: 36,
                                                // borderTopLeftRadius: 0,
                                                // borderBottomLeftRadius: 0,
                                                borderRadius: 0,
                                                borderRightWidth: 0,
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 50,
                                                paddingVertical: theme.padding.sm,
                                                paddingHorizontal: theme.padding.md,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderRightWidth: 0,
                                                borderColor: theme.colors.schemes.light.outlineVariant,
                                                // borderTopLeftRadius: theme.borderRadius.sm,
                                                // borderBottomLeftRadius: theme.borderRadius.sm,
                                                borderRadius: 0,
                                                backgroundColor: theme.colors.schemes.light.surfaceContainerHighest,
                                                ...shadow.sm
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontWeight: 500,
                                                    letterSpacing: theme.letterSpacing.xl,
                                                    color: theme.colors.schemes.light.onSurfaceVariant
                                                }}
                                            >
                                                Max
                                            </ThemedText>
                                        </View>
                                        <InputText
                                            value={range[1] + ""}
                                            onChangeText={(text) => setRange([range[0], parseInt(text)])}
                                            wrapperStyle={{
                                                flexShrink: 1,
                                                // width: 100,
                                            }}
                                            inputStyle={{
                                                height: 36,
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0,
                                            }}
                                        />
                                    </View>
                                </View>
                                <Slider
                                    value={range}
                                    minimumValue={0}
                                    maximumValue={60}
                                    step={1}
                                    onValueChange={(range) => setRange(range)}
                                />
                            </View>
                            <View
                                style={{
                                    paddingVertical: theme.padding["2xl"],
                                    rowGap: theme.padding.md,
                                    borderTopWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: theme.fontSize.base,
                                        fontWeight: 500,
                                        letterSpacing: theme.letterSpacing.xl,
                                        color: theme.colors.schemes.light.onSurface
                                    }}
                                >
                                    Workout Type
                                </ThemedText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        gap: theme.padding.md,
                                    }}
                                >
                                    {types.map((type_, i) => (
                                        <Pressable
                                            key={i}
                                            onPress={() => {
                                                if (type.includes(type_[0])) {
                                                    const updated = [...type];
                                                    updated.splice(type.indexOf(type_[0]), 1);
                                                    setType([...updated]);
                                                }
                                                else {
                                                    setType([...type, type_[0]]);
                                                }
                                            }}
                                            style={{
                                                paddingVertical: theme.padding.md,
                                                paddingHorizontal: theme.padding.xl,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                columnGap: theme.padding.md,
                                                borderRadius: 1000,
                                                borderWidth: 1,
                                                borderColor: type.includes(type_[0]) ? theme.colors.coreColors.primary : theme.colors.schemes.light.surfaceContainerHighest,
                                                backgroundColor: type.includes(type_[0]) ? theme.colors.coreColors.primary : "white",
                                                ...theme.shadow.sm
                                            }}
                                        >
                                            {type.includes(type_[0]) &&
                                                <CheckIcon
                                                    size={14}
                                                    strokeWidth={2.5}
                                                    color="white"
                                                />
                                            }
                                            <ThemedText
                                                style={{
                                                    fontSize: theme.fontSize.md,
                                                    fontWeight: 500,
                                                    letterSpacing: theme.letterSpacing.xl,
                                                    color: type.includes(type_[0]) ? "white" : theme.colors.schemes.light.onSurfaceVariant
                                                }}
                                            >
                                                {type_[1]}
                                            </ThemedText>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </BottomScreen>
                }
                <Header
                    openSideBar={sideBar.openSideBar}
                />
                <ScrollView
                    style={{
                        height: "100%",
                        // paddingVertical: theme.margin.sm,
                        // paddingHorizontal: theme.margin.sm,
                        flex: 1,
                        flexGrow: 1,
                    }}
                >
                    {/* Section 1 */}
                    <View
                        style={{
                            paddingVertical: theme.padding.md,
                            paddingHorizontal: theme.padding.md,
                            flex: 1,
                            rowGap: theme.padding.md,
                            borderBottomWidth: 1,
                            borderStyle: "dashed",
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            backgroundColor: theme.colors.schemes.light.surfaceContainerLow
                        }}
                    >
                        <View
                            style={{
                                rowGap: theme.padding.md
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    columnGap: theme.padding.md
                                }}
                            >
                                <InputDropdownV2
                                    value={feed}
                                    onChange={setFeed}
                                    options={feedOptions as [string, string][]}
                                    buttonStyle={{
                                        borderRadius: 8,
                                        height: 36,
                                        minHeight: 36,
                                        maxHeight: 36,
                                        paddingHorizontal: theme.padding.lg,
                                    }}
                                />
                                <CreateWorkoutButton
                                    onPress={() => router.push("/createSession")}
                                />  
                            </View>
                            <SearchBar
                                search={searchBar.search}
                                setSearch={searchBar.setSearch}
                                // placeholder="Search Workouts"
                                enableSort={false}
                                containerStyle={{
                                    height: 36,
                                }}
                                childrenLeftOfSort={
                                    <InputDropdownV2
                                        value={searchBar.searchKey}
                                        onChange={searchBar.setSearchKey}
                                        options={searchBar.searchKeyOptions as [string, string][]}
                                        buttonStyle={{
                                            height: "100%",
                                            borderRadius: 0,
                                            borderRightWidth: 0,
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0
                                        }}
                                    />
                                }
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    columnGap: theme.padding.md,
                                }}
                            >
                                <FilterButton
                                    onPress={() => setShowFilter(true)}
                                />
                                <SortButton
                                    searchBar={searchBar}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Section 2 */}
                    <View
                        style={{
                            paddingHorizontal: theme.padding.md,
                            paddingVertical: theme.padding.lg,
                            rowGap: theme.margin.sm
                        }}
                    >
                        <View
                            style={{
                                rowGap: theme.padding.lg
                            }}
                        >
                            {searchBar.filtered.map((workout, i) => (
                                <Fragment
                                    key={i}
                                >
                                    <WorkoutCardList
                                        {...workout}
                                    />
                                </Fragment>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}