import SearchBar from "@/components/Classes/SearchBar";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar/SideBar";
import useSideBar from "@/components/SideBar/useSideBar";
import ThemedText from "@/components/ThemedText";
import { joinClass, Class, getClasses } from "@/services/classes";
import { colors } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardClass from "@/components/Classes/CardClass";
import JoinClassButton1 from "@/components/Classes/JoinClassButton1";
import CreateClassButton from "@/components/Classes/CreateClassButton";
import JoinClassButton2 from "@/components/Classes/JoinClassButton2";
import ModalJoinClass from "@/components/Classes/ModalJoinClass";

export default function Classes() {
    const [classes, setClasses] = useState<Array<Class>>([]);
    const [filteredClasses, setFilteredClasses] = useState<Array<Class>>([]);
    const [showJoinClass, setShowJoinClass] = useState(false);
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [search, setSearch] = useState("");
    const [classCode, setClassCode] = useState("");
    const [sortDirection, setSortDirection] = useState<0|1|2>(0);
    const sideBar = useSideBar();

    useEffect(() => {
        loadClasses();
    }, []);


    useEffect(() => {
        if (!showJoinClass)
            setClassCode("");
    }, [showJoinClass]);


    // Search and Sort Classes
    useEffect(() => {
        let filteredClasses = [...classes];
        
        if (search) {
            filteredClasses = filteredClasses.filter((class_) => {
                return class_.name.toLowerCase().includes(search.toLowerCase());
            });
        }
        
        if (sortDirection) {
            filteredClasses.sort((a, b) => {
                if (sortDirection === 1)
                    return a.name.localeCompare(b.name);
                return b.name.localeCompare(a.name);
            });
        }

        setFilteredClasses(filteredClasses);
    }, [search, sortDirection, classes]);


    const loadClasses = async () => {
        // To whom does this ID belong to?
        // A student or teacher?
        const id = 0;
        const role = "Student";
        const classes = await getClasses(id, role);
        setClasses(classes);
        setFilteredClasses(classes);
    }


    const addClass_ = async (classCode: string) => {
        // The student's ID would be provided
        // elsewhere, but walk with me.
        const studentID = 0;
        if (await joinClass(classCode, studentID)) {
            setShowJoinClass(false);
            loadClasses();
            return true;
        }
        return false;
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
            {showJoinClass &&
                <ModalJoinClass
                    classCode={classCode}
                    setClassCode={setClassCode}
                    setShowJoinClass={setShowJoinClass}
                    onJoin={async () => addClass_(classCode)}
                />
            }
            <SafeAreaView
                edges={["top"]}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    minWidth: Dimensions.get('window').width,
                    backgroundColor: colors.palettes.neutral[0],
                    position: "relative"
                }}
            >
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
                                    onPress={() => setShowJoinClass(true)}
                                />
                                <JoinClassButton2
                                    onPress={() => setShowJoinClass(true)}
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
                    <JoinClassButton1
                        onPress={() => setShowJoinClass(true)}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}