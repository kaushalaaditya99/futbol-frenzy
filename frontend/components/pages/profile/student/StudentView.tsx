import Profile from "@/app/profile";
import { useAuth } from "@/contexts/AuthContext";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import ProfilePicture from "@/components/ui/user/ProfilePicture";
import { Class, getClasses } from "@/services/classes";
import { Drillv2 as Drill, getDrills } from "@/services/drills";
import { getSessions, Session } from "@/services/sessions";
import { margin, shadow, theme } from "@/theme";
import { Fragment, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, ClipPath, Defs, G, Image, Path, Pattern, Text, TextPath, TSpan } from "react-native-svg";
import RowCardClass from "../../classes/RowCardClass";
import { BookTextIcon, ChartLineIcon, DumbbellIcon, MoveDownIcon, MoveUpIcon, StarIcon, ZapIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { CurveType, LineChart } from "react-native-gifted-charts";
import CardMetric from "../../CardMetric";
import DisclosureButton from "../../class/coach/TabProgress/DisclosureButton";
import DrillCardList from "../../drills/DrillCardList";
import WorkoutCardList from "../../workouts/WorkoutCardList";

// https://github.com/software-mansion/react-native-svg/issues/972
const ProfilePictureWithLabel = (props: any) => {
    const text = "Student";
    const fontSize = 10;
    const length = 24*5.5;
    const center = length / 2;
    const radius = (24*4.5)/2;
    const textRadius = radius + 12;
    const circumference = 2 * Math.PI * textRadius;
    const textWidth = text.length * fontSize * 0.75;
    const offset = `${25 - (textWidth / circumference * 100) / 2}%`;
    const offsetTop = `${75 - (textWidth / circumference * 100) / 2}%`;
    const offsetLeft = `${50 - (textWidth / circumference * 100) / 2}%`;
    const offsetRight1 = `${100 - (textWidth / circumference * 100) / 2}%`;
    const offsetRight2 = `${0 - (textWidth / circumference * 100) / 2}%`;

    return (
        <Svg 
            width={length}
            height={length} 
            style={{
                // backgroundColor: theme.colors.coreColors.primary, 
                margin: 0, 
                padding: 0, 
                borderRadius: 1000,
            }} 
            viewBox={`0 0 ${length} ${length}`} 
            {...props}
        >
            <Defs>
                <Pattern id="imgPattern" x={0} y={0} width={length} height={length}>
                    <Image
                        width={length}
                        height={length}
                        preserveAspectRatio="xMidYMid slice"
                        href={require('../../../../assets/images/Pedri-11.jpg')}
                    />
                </Pattern>
                <Path
                    id="circlePath"
                    d={`M ${center},${center} m -${textRadius},0 a ${textRadius},${textRadius} 0 1,0 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,0 -${textRadius * 2},0`}
                    fill="none"
                />
            </Defs>
            <G id="circle">
                <Circle
                    r={radius}
                    transform={[
                        { translateX: center }, 
                        { translateY: center }
                    ]}
                    fill="url(#imgPattern)"
                />
            </G>
            <Text 
                fill={theme.colors.coreColors.primary}
                fontSize="10"
                fontWeight={400}
                fontFamily="Silkscreen"
            >
                <TextPath 
                    href="#circlePath" 
                    startOffset={offset}
                >
                    Student
                </TextPath>
            </Text>
            <Text 
                fill={theme.colors.coreColors.primary}
                fontSize="10"
                fontWeight={400}
                fontFamily="Silkscreen"
            >
                <TextPath 
                    href="#circlePath" 
                    startOffset={offsetTop}
                >
                    Student
                </TextPath>
            </Text>
            <Text 
                fill={theme.colors.coreColors.primary}
                fontSize="10"
                fontWeight={400}
                fontFamily="Silkscreen"
            >
                <TextPath 
                    href="#circlePath" 
                    startOffset={offsetRight1}
                >
                    Student
                </TextPath>
            </Text>
            <Text 
                fill={theme.colors.coreColors.primary}
                fontSize="10"
                fontWeight={400}
                fontFamily="Silkscreen"
            >
                <TextPath 
                    href="#circlePath" 
                    startOffset={offsetRight2}
                >
                    Student
                </TextPath>
            </Text>
            <Text 
                fill={theme.colors.coreColors.primary}
                fontSize="10"
                fontWeight={400}
                fontFamily="Silkscreen"
            >
                <TextPath 
                    href="#circlePath" 
                    startOffset={offsetLeft}
                >
                    Student
                </TextPath>
            </Text>
        </Svg>
    )
};

const lineData = [
        {value: 0},
        {value: 10},
        {value: 8},
        {value: 58},
        {value: 56},
        {value: 78},
        {value: 74},
        {value: 98},
    ];
  
    const lineData2 = [
        {value: 0},
        {value: 20},
        {value: 18},
        {value: 40},
        {value: 36},
        {value: 60},
        {value: 54},
        {value: 85},
    ];

export default function StudentView() {
    const router = useRouter();
    const { token } = useAuth();

    const [tab, setTab] = useState("Classes");
    const [tabs] = useState(["Classes", "Overview", "Your Drills", "Your Workouts"]);

    const [classes, setClasses] = useState<Class[]>([]);
    const [drills, setDrills] = useState<Drill[]>([]);
    const [workouts, setWorkouts] = useState<Session[]>([]);

    const [showDisclosure, setShowDisclosure] = useState("");
    const [view, setView] = useState("aggregate");
    const [studentIDs, setStudentIDs] = useState<number[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [metric, setMetric] = useState("accuracy");
    const [category, setCategory] = useState("drills");
    const [instances, setInstances] = useState<number[]>([]);

    useEffect(() => {
        const load = async () => {
            if (!token) return;
            setClasses(await getClasses(token));
            setDrills(await getDrills());
            setWorkouts(await getSessions(token));
        }
        load();
    }, []);

    useEffect(() => {
        const day = new Date();
        setEndDate(day.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }));

        day.setDate(day.getDate() - 30);
        setStartDate(day.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }));
    }, []);
    
    const closeDisclosure = () => {
        setShowDisclosure("");
    }


    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.background,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: "white"
                }}
            >
                <HeaderWithBack
                    header=""
                    onBack={() => router.push("/(tabs)")}
                    containerStyle={{
                        paddingVertical: theme.margin.xs,
                        paddingHorizontal: theme.margin.xs,
                        backgroundColor: theme.colors.schemes.light.background,
                    }}
                />
                <View
                    style={{
                        padding: theme.margin.sm,
                        rowGap: theme.padding.md,
                        borderBottomWidth: 1,
                        borderStyle: "dashed",
                        borderColor: theme.colors.schemes.light.outlineVariant,
                    }}
                >
                    <ProfilePicture
                        width={24*4.5}
                        height={24*4.5}
                    />
                    <View
                        style={{
                            rowGap: theme.padding.sm
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: theme.padding.md,
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: theme.fontSize["xl"],
                                    fontWeight: 600,
                                    letterSpacing: theme.letterSpacing["2xs"]
                                }}
                            >
                                John Smith
                            </ThemedText>
                            <View
                                style={{
                                    paddingVertical: theme.padding.sm,
                                    paddingHorizontal: theme.padding.md,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    columnGap: theme.padding.md,
                                    // fontSize: theme.fontSize["xs"],
                                    // fontWeight: 600,
                                    // letterSpacing: theme.letterSpacing["xl"],
                                    // color: "white",
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                    backgroundColor: "white",
                                    ...shadow.sm
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: theme.fontSize["xs"],
                                        fontWeight: 600,
                                        letterSpacing: theme.letterSpacing["xl"],
                                        color: theme.colors.coreColors.primary
                                }}
                                >
                                    STUDENT
                                </ThemedText>
                                {/* <StarIcon
                                    size={8}
                                    color="orange"
                                    fill="orange"
                                /> */}
                            </View>
                        </View>
                        <ThemedText
                            style={{
                                fontSize: theme.fontSize["base"],
                                fontWeight: 400,
                                color: theme.colors.schemes.light.onSurfaceVariant,
                                letterSpacing: theme.letterSpacing["2xl"]
                            }}
                        >
                            smith@gmail.com
                        </ThemedText>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: theme.margin.sm,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        columnGap: theme.padding.md,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: "white"
                    }}
                >
                    {tabs.map((currTab, i) => (
                        <Pressable
                            key={i}
                            onPress={() => setTab(currTab)}
                            style={{
                                position: "relative",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: theme.padding.sm,
                            }}
                        >
                            {/* {currTab === "Classes" &&
                                <BookTextIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            } */}
                            {/* {currTab === "Overview" &&
                                <ChartLineIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            } */}
                            {/* {currTab === "Your Drills" &&
                                <ZapIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            } */}
                            {/* {currTab === "Your Workouts" &&
                                <DumbbellIcon
                                    size={14}
                                    stroke={currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            } */}
                            <ThemedText
                                style={{
                                    paddingVertical: theme.padding.lg,
                                    fontSize: theme.fontSize.md,
                                    fontWeight: currTab === tab ? 400 : 400,
                                    letterSpacing: theme.letterSpacing.xl * 2,
                                    color: currTab === tab ? theme.colors.coreColors.primary : theme.colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                {currTab}
                            </ThemedText>
                            {currTab === tab &&
                                <View
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        bottom: -1,
                                        width: "100%",
                                        height: 1,
                                        borderRadius: 1000,
                                        backgroundColor: theme.colors.coreColors.primary
                                    }}
                                />
                            }
                        </Pressable>
                    ))}
                </View>
                <View
                    style={{
                        paddingVertical: theme.padding.md,
                        paddingHorizontal: theme.padding.md,
                        flex: 1,
                        backgroundColor: "white"
                    }}
                >
                    {tab === "Your Drills" &&
                        <View
                            style={{
                                flex: 1,
                                rowGap: theme.padding.md
                            }}
                        >
                            {drills.map((drill, i) => (
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
                    {tab === "Your Workouts" &&
                        <View
                            style={{
                                flex: 1,
                                rowGap: theme.padding.md
                            }}
                        >
                            {workouts.map((workout, i) => (
                                <Fragment
                                    key={i}
                                >
                                    <WorkoutCardList
                                        {...workout}
                                    />
                                </Fragment>
                            ))}
                        </View>
                    }
                    {tab === "Classes" &&
                        <View
                            style={{
                                rowGap: theme.padding.md,
                            }}
                        >
                            {classes.map((class_, i) => (
                                <Fragment
                                    key={i}
                                >
                                    <RowCardClass
                                        {...class_}
                                    />
                                </Fragment>
                            ))}
                        </View>
                    }
                    {tab === "Overview" &&
                        <View
                            style={{
                                rowGap: theme.padding.md,
                            }}
                        >
                            <View
                                style={{
                                    // paddingBottom: theme.padding.md,
                                    flexDirection: "row",
                                    columnGap: theme.padding.md,
                                    // borderBottomWidth: 1,
                                    // borderColor: theme.colors.schemes.light.outlineVariant
                                }}
                            >
                                <CardMetric
                                    label={"Avg. Score"}
                                    labelStyle={{
                                        color: "#307351"
                                    }}
                                    value="7/10"
                                    valueIcon={
                                        <MoveUpIcon
                                            size={14}
                                            strokeWidth={2.5}
                                            color={"#307351"}
                                        />
                                    }
                                    valueIconSide="right"
                                />
                                <CardMetric
                                    label="Avg. Completion"
                                    labelStyle={{
                                        color: "#D7263D"
                                    }}
                                    value="60%"
                                    valueIcon={
                                        <MoveDownIcon
                                            size={14}
                                            strokeWidth={2.5}
                                            color={"#D7263D"}
                                        />
                                    }
                                    valueIconSide="right"
                                />
                                <CardMetric
                                    label="Avg. Duration"
                                    labelStyle={{
                                        color: theme.colors.schemes.light.onSurface
                                    }}
                                    value="43s"
                                />
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    padding: theme.padding.lg,
                                    paddingBottom: theme.padding.lg - 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: theme.borderRadius.lg,
                                    borderWidth: 1,
                                    borderColor: theme.colors.schemes.light.outlineVariant,
                                }}
                            >
                                
                                <View
                                    style={{
                                        borderTopWidth: 1,
                                        borderColor: theme.colors.schemes.light.outlineVariant
                                    }}
                                >
                                    <LineChart
                                        disableScroll={true} 
                                        backgroundColor={"white"}
                                        
                                        width={Dimensions.get("screen").width - theme.padding.md - theme.padding.md - (theme.padding.lg * 2)}
                                        adjustToWidth
                                        parentWidth={Dimensions.get("screen").width - theme.padding.md - theme.padding.md}
                                        initialSpacing={0}
                                        endSpacing={0}
                                        data={lineData}
                                        data2={lineData2}
                                        // trimYAxisAtTop={true}
                                        // spacing={30}
                                        // hideDataPoints
                                        thickness={1}
                                        // hideRules
                                        hideYAxisText
                                        // hideXAXisTest
                                        yAxisThickness={0}
                                        // xAxisThickness={0}
                                        // showXAxisIndices={false}
                                        xAxisIndicesHeight={0}
                                        xAxisIndicesWidth={0}
                                        // xAxisLabelsVerticalShift={-10}
                                        xAxisLabelsAtBottom={false}
                                        yAxisLabelWidth={0}
                                        xAxisLabelsHeight={0}
                                        // hideRules={true}
                                        // rulesThickness={0}
                                        // overflowBottom={-10}
                                        // hideAxesAndRules
                                        // xAxisLabelTexts={["help"]}
                                        // hideDataPoints
                                        yAxisColor={theme.colors.schemes.light.outlineVariant}
                                        showVerticalLines
                                        verticalLinesColor={theme.colors.schemes.light.outlineVariant}
                                        xAxisColor={theme.colors.schemes.light.outlineVariant}
                                        color={"#1a1ac2"}
                                        color2={"#3877ff"}
                                        dataPointsColor="black"
                                        curved={true}
                                        curveType={CurveType.QUADRATIC}
                                        isAnimated={true}
                                        animateOnDataChange
                                        animationDuration={1000}
                                        onDataChangeAnimationDuration={300}
                                        // textColor1="yellow"
                                        // textShiftY={-8}
                                        // textShiftX={-10}
                                        // textFontSize={13}
                                        showValuesAsDataPointsText={false}
                                        areaChart
                                        startFillColor={theme.colors.coreColors.primary}
                                        endFillColor={theme.colors.coreColors.primary}
                                        startOpacity={0.4}
                                        endOpacity={0.1}
                                        showDataPointLabelOnFocus={false}
                                        focusEnabled={false}
                                        showStripOnFocus={false}
                                        showTextOnFocus={false}
                                        // focusedDataPointShape="square"
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    // margin: theme.padding.lg,
                                }}
                            >
                                <DisclosureButton
                                    label="View"
                                    value={view.charAt(0).toUpperCase() + view.substring(1)}
                                    level="top"
                                    onDisclose={() => setShowDisclosure("View")}
                                />
                                <DisclosureButton
                                    label="Range"
                                    value={`${startDate} - ${endDate}`}
                                    level="middle"
                                    onDisclose={() => setShowDisclosure("Range")}
                                />
                                <DisclosureButton
                                    label="Metric"
                                    value={metric.charAt(0).toUpperCase() + metric.substring(1)}
                                    level="middle"
                                    onDisclose={() => setShowDisclosure("Metric")}
                                />
                                <DisclosureButton
                                    label="Category"
                                    value={category.charAt(0).toUpperCase() + category.substring(1)}
                                    level="middle"
                                    onDisclose={() => setShowDisclosure("Category")}
                                />
                                <DisclosureButton
                                    label={`${category === "drill" ? "Drill" : "Session"} Instances`}
                                    value={category === "drill" ? (instances.length === drills.length ? "All" : (instances.length === 0 ? "None Selected" : `${instances.length} Selected`)) : ((instances.length === workouts.length ? "All" : (instances.length === 0 ? "None Selected" : `${instances.length} Selected`)))}
                                    level="bottom"
                                    onDisclose={() => setShowDisclosure("Instances")}
                                />
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}