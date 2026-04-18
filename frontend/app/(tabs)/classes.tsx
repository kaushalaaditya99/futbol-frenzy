import { Class, getClasses } from "@/services/classes";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RowCardClass from "@/components/pages/classes/RowCardClass";
import MissingClass from "@/components/pages/classes/MissingClass";
import CreateClassButton from "@/components/pages/classes/coach/CreateClassButton";
import JoinClassButton from "@/components/pages/classes/student/JoinClassButton";
import { router, useFocusEffect } from "expo-router";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import Header from "@/components/ui/user/Header";
import ThemedText from "@/components/ui/ThemedText";
import SearchBar from "@/components/ui/SearchBar";
import useSearchBar from "@/hooks/useSearchBar";
import { useAuth } from "@/contexts/AuthContext";

export default function Classes() {
    const { token, role } = useAuth();
    const [classes, setClasses] = useState<Array<Class>>([]);
    const [isCoach, setIsCoach] = useState(false);
    const sideBar = useSideBar();
    const searchBar = useSearchBar(classes, "className", "className");


    useEffect(() => {
        loadClasses();
    }, [token]);


    useFocusEffect(
        useCallback(() => {
            loadClasses();
        }, [token])
    );

    //in case the conditional doesn't work for whatever reason
    useEffect(() => {
      if (!role)
      {
        return;
      }
      setIsCoach(role == "Coach")
    }, [role]);

    const loadClasses = async () => {
        if (!token)
            return;
        const classes = await getClasses(token);
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
                                    fontSize: fontSize.lg,
                                    fontWeight: "500",
                                    letterSpacing: letterSpacing.xs,
                                    color: colors.schemes.light.onBackground,
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
                                {role !== "Student" &&
                                    <CreateClassButton
                                        onPress={() => router.push("/createClass")}
                                    />
                                }
                                {role !== "Coach" &&
                                  <JoinClassButton
                                    onPress={() => router.push("/joinClass")}
                                  />
                                }
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
