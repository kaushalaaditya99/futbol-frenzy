import { Class, getClasses } from "@/services/classes";
import { colors, margin, padding } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RowCardClass from "@/components/pages/classes/RowCardClass";
import MissingClass from "@/components/pages/classes/MissingClass";
import CreateClassButton from "@/components/pages/classes/coach/CreateClassButton";
import JoinClassButton from "@/components/pages/classes/student/JoinClassButton";
import { router } from "expo-router";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import Header from "@/components/ui/user/Header";
import ThemedText from "@/components/ui/ThemedText";
import SearchBar from "@/components/ui/SearchBar";
import useSearchBar from "@/hooks/useSearchBar";

export default function Classes() {
    const [classes, setClasses] = useState<Array<Class>>([]);
    const sideBar = useSideBar();
    const searchBar = useSearchBar(classes, "name", "name");

    useEffect(() => {
        loadClasses();
    }, []);


    const loadClasses = async () => {
        // To whom does this ID belong to?
        // A student or teacher?
        // Does this differentiation matter in the DB?
        const id = 0;
        const role = "Student";
        const classes = await getClasses(id, role);
        setClasses(classes);
        searchBar.setFiltered(classes);
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
                    backgroundColor: colors.schemes.light.background,
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
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        backgroundColor: colors.schemes.light.surface,
                    }}
                >
                    <View
                        style={{
                            rowGap: padding.lg
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 18,
                                    fontWeight: 500,
                                    letterSpacing: -0.25
                                }}
                            >
                                My Classes
                            </ThemedText>
                            <View
                                style={{
                                    flexDirection: "row",
                                    columnGap: padding.md
                                }}
                            >
                                <CreateClassButton
                                    onPress={() => router.push("/createClass")}
                                />
                                <JoinClassButton
                                    onPress={() => router.push("/joinClass")}
                                />
                            </View>
                        </View>
                        <SearchBar
                            search={searchBar.search}
                            setSearch={searchBar.setSearch}
                            enableSort={true}
                            sortDirection={searchBar.sortDirection}
                            setSortDirection={searchBar.setSortDirection}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: padding.lg,
                            rowGap: padding.lg
                        }}
                    >
                        {searchBar.filtered.map((class_, i) => (
                            <Fragment key={i}>
                                <RowCardClass
                                    {...class_}
                                />
                            </Fragment>
                        ))}
                    </View>
                    <MissingClass
                        onPress={() => {
                            router.push("/joinClass");
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
