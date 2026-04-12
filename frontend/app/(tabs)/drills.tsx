import CreateDrillButton from "@/components/pages/drills/CreateDrillButton";
import DrillCardGrid from "@/components/pages/drills/DrillCardGrid";
import DrillCardList from "@/components/pages/drills/DrillCardList";
import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import Filter from "@/components/pages/drills/Filter";
import useDrillSearchBar from "@/components/pages/drills/useDrillSearchBar";
import ThemedText from "@/components/ui/ThemedText";
import Header from "@/components/ui/user/Header";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import { Drill, getDrills } from "@/services/drills";
import { fontSize, letterSpacing, margin, padding, theme } from "@/theme";
import { router } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dimensions, FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Drills() {
    const feedOptions = [
        ["library", "My Library"],
        ["explore", "Explore"],
        ["bookmark", "Bookmarks"]
    ];

    const [feed, setFeed] = useState("library");
    const [viewType, setViewType] = useState("list");

    const { role, token } = useAuth();
    const sideBar = useSideBar();
    const [drills, setDrills] = useState<Array<Drill>>([]);
    const drillSearchBar = useDrillSearchBar(drills);

    useEffect(() => {
        const id = 0;
        loadDrills(id, token);
    }, [token]);

    const loadDrills = async (id: number) => {
        const drills = await getDrills(token);
        setDrills(drills);
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
                    openSideBar={() => sideBar.setShowSideBar(true)}
                />
                <ScrollView
                    style={{
                        height: "100%",
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        flex: 1,
                        flexGrow: 1,
                    }}
                >
                    <View
                        style={{
                            paddingBottom: theme.margin.sm,
                            flex: 1,
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
                                }}
                            />
                            {role === "Coach" && (
                                <CreateDrillButton
                                    onPress={() => router.push("/createDrill")}
                                />
                            )}
                       </View>
                       <Filter
                            viewType={viewType}
                            setViewType={setViewType}
                            drillSearchBar={drillSearchBar}
                       />
                       <ThemedText
                            style={{
                                marginTop: theme.margin.sm,
                                fontSize: fontSize.lg,
                                fontWeight: "500",
                                letterSpacing: letterSpacing.xs,
                                color: theme.colors.schemes.light.onBackground,
                            }}
                        >
                            Found {drillSearchBar.filtered.length} Drills
                        </ThemedText>
                       {viewType === "grid" &&
                            <View>
                                <FlatList<Drill>
                                    scrollEnabled={false}
                                    data={drillSearchBar.filtered}
                                    numColumns={2}
                                    contentContainerStyle={{ gap: 12 }}
                                    columnWrapperStyle={{ gap: padding.lg }}
                                    renderItem={({item}: any) => (
                                        <DrillCardGrid
                                            {...item}
                                        />
                                    )}
                                />
                            </View>
                       }
                       {viewType === "list" &&
                            <View
                                style={{
                                    rowGap: theme.padding.lg
                                }}
                            >
                                {drillSearchBar.filtered.map((drill, i) => (
                                    <Fragment
                                        key={i}
                                    >
                                        <DrillCardList
                                            {...drill}
                                        />
                                    </Fragment>
                                ))}
                            </View>
                       }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
