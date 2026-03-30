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
import { Drill as Drill, getDrills } from "@/services/drills";
import { fontSize, margin, padding, theme } from "@/theme";
import { router, useFocusEffect } from "expo-router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Drills() {
    
    const [viewType, setViewType] = useState("list");

    const sideBar = useSideBar();
    const [drills, setDrills] = useState<Array<Drill>>([]);
    const drillSearchBar = useDrillSearchBar(drills);
    
    useEffect(() => {
        loadDrills();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadDrills();
        }, [])
    );

    const loadDrills = async () => {
        const drills = await getDrills();
        console.log(drills);
        setDrills(drills);
        drillSearchBar.setFiltered(drills);
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
                                value={drillSearchBar.feed}
                                onChange={drillSearchBar.setFeed}
                                options={drillSearchBar.feedOptions as any}
                                buttonStyle={{
                                    borderRadius: 8,
                                }}
                            />
                            <CreateDrillButton
                                onPress={() => router.push("/createDrill")}
                            />  
                       </View>
                       <Filter
                            viewType={viewType}
                            setViewType={setViewType}
                            drillSearchBar={drillSearchBar}
                       />
                       <ThemedText
                            style={{
                                marginTop: theme.margin.sm,
                                fontSize: theme.fontSize.base,
                                fontWeight: 500,
                                letterSpacing: -0.25
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