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
import { Fragment, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dimensions, FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";


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
        loadDrills(id);
        console.log("Drills loaded")
    }, [token]);


    useFocusEffect(
      useCallback(() => {
          const id = 0;
            loadDrills(id);
        }, [token])
    );

    const loadDrills = async (id: number) => {
        if (!token)
            return;
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
                    </View>
                    {/* Section 2 */}
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: theme.padding.md,
                            paddingVertical: theme.padding.lg,
                            rowGap: theme.margin.sm
                        }}
                    >
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
