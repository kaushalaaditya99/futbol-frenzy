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
import { spacing, theme } from "@/theme";
import { router } from "expo-router";
import { FilterIcon } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SortButton from "@/components/pages/workouts/SortButton";
import WorkoutCardList from "@/components/pages/workouts/WorkoutCardList";

export default function Workouts() {
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

    useEffect(() => {
        // Random ID
        loadWorkouts(0);
    }, []);


    const loadWorkouts = async (id: number) => {
        const workouts = await getSessions(id);
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
                                    onPress={() => router.push("/createDrill")}
                                />  
                            </View>
                            <SearchBar
                                search={searchBar.search}
                                setSearch={searchBar.setSearch}
                                placeholder="Search Workouts"
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
                                <FilterButton/>
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
                            paddingVertical: theme.padding.md,
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