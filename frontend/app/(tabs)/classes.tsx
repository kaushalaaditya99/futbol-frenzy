import SearchBar from "@/components/Classes/SearchBar";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar/SideBar";
import useSideBar from "@/components/SideBar/useSideBar";
import ThemedText from "@/components/ThemedText";
import { joinClass, Class, getClasses } from "@/services/classes";
import { colors } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardClass from "@/components/Classes/CardClass";
import MissingClass from "@/components/Classes/MissingClass";
import CreateClassButton from "@/components/Classes/CreateClassButton";
import JoinClassButton from "@/components/Classes/JoinClassButton";
import { router } from "expo-router";

export default function Classes() {
    const [classes, setClasses] = useState<Array<Class>>([]);
    const [search, setSearch] = useState("");
    const [sortDirection, setSortDirection] = useState<0|1|2>(0);
    const [filteredClasses, setFilteredClasses] = useState<Array<Class>>([]);
    const sideBar = useSideBar();


    useEffect(() => {
        loadClasses();
    }, []);


    useEffect(() => {
        let classesFiltered = [...classes];
        
        if (search) {
            const searchLowerCase = search.toLowerCase();
            classesFiltered = classesFiltered.filter((class_) => {
                const classNameLower = class_.name.toLowerCase();
                const match = classNameLower.includes(searchLowerCase)
                return match;
            });
        }
        
        if (sortDirection) {
            classesFiltered.sort((a, b) => {
                if (sortDirection === 1)
                    return a.name.localeCompare(b.name);
                return b.name.localeCompare(a.name);
            });
        }

        setFilteredClasses(classesFiltered);
    }, [search, sortDirection, classes]);


    const loadClasses = async () => {
        // To whom does this ID belong to?
        // A student or teacher?
        // Does this differentiation matter in the DB?
        const id = 0;
        const role = "Student";
        const classes = await getClasses(id, role);
        setClasses(classes);
        setFilteredClasses(classes);
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
                    <Pressable
                        onPress={() => sideBar.setShowSideBar(false)}
                        style={{
                            position: "absolute",
                            zIndex: 100,
                            height: Dimensions.get('window').height,
                            minHeight: Dimensions.get('window').height,
                            width: Dimensions.get('window').width,
                            minWidth: Dimensions.get('window').width,
                            backgroundColor: "#000000D0"
                        }}
                    />
                }
                <Header
                    openSideBar={() => sideBar.setShowSideBar(true)}
                />
                <ScrollView
                    style={{
                        paddingVertical: 24,
                        paddingHorizontal: 24,
                        backgroundColor: colors.schemes.light.surface,
                    }}
                >
                    <View
                        style={{
                            rowGap: 12
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
                                    columnGap: 8
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
                            search={search}
                            setSearch={setSearch}
                            onSearch={() => null}
                            sortDirection={sortDirection}
                            setSortDirection={setSortDirection}
                        />
                    </View>
                    <View
                        style={{
                            rowGap: 12
                        }}
                    >
                        {filteredClasses.map((class_, i) => (
                            <Fragment key={i}>
                                <CardClass
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