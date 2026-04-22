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
    const [viewType, setViewType] = useState("list");

    const { role, token } = useAuth();
    const sideBar = useSideBar();
    const [drills, setDrills] = useState<Array<Drill>>([]);
    const drillSearchBar = useDrillSearchBar(drills);


    useFocusEffect(
      useCallback(() => {
            console.log('called')
            loadDrills();
        }, [token])
    );

    const loadDrills = async () => {
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
                                value={drillSearchBar.feed}
                                onChange={drillSearchBar.setFeed}
                                options={drillSearchBar.feedOptions as any}
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
                                    contentContainerStyle={{ flexGrow: 1, gap: 12 }}
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
                                        key={drill.id}
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
