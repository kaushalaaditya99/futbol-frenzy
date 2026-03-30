import { colors, margin, padding } from "@/theme";
import { Dimensions, View } from "react-native";
import CardMetric from "../../../CardMetric";
import { MoveDown, MoveUp } from "lucide-react-native";
import { LineChart } from "react-native-gifted-charts";
import DisclosureButton from "./DisclosureButton";
import { useEffect, useState } from "react";
import DisclosureView from "./DisclosureView";
import DisclosureStudents from "./DisclosureStudents";
import DisclosureRange from "./DisclosureRange";
import DisclosureMetric from "./DiscolsureMetric";
import DisclosureCategory from "./DisclosureCategory";
import DisclosureInstances from "./DisclosureInstances";
import useSearchBar from "@/hooks/useSearchBar";
import { Student } from "@/services/students";
import { Drill as Drill } from "@/services/drills";
import { Session } from "@/services/sessions";
import ThemedText from "@/components/ui/ThemedText";

interface TabProgressProps {
    drills: Array<Drill>;
    sessions: Array<Session>;
    students: Array<Student>;
}

const getStudentFullName = (student: Student) => `${student.fName} ${student.lName}`;

export default function TabProgress(props: TabProgressProps) {
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

    const [showDisclosure, setShowDisclosure] = useState("");
    const [view, setView] = useState("aggregate");
    const [studentIDs, setStudentIDs] = useState<number[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [metric, setMetric] = useState("accuracy");
    const [category, setCategory] = useState("drills");
    const [instances, setInstances] = useState<number[]>([]);

    const studentSearchBar = useSearchBar<Student>(
        props.students, 
        getStudentFullName, 
        getStudentFullName
    );

    const drillSearchBar = useSearchBar<Drill>(
        props.drills, 
        (drill: Drill) => `${drill.drillName}`, 
        (drill: Drill) => `${drill.drillName}`
    );

    const sessionSearchBar = useSearchBar<Session>(
        props.sessions, 
        (session: Session) => `${session.name}`, 
        (session: Session) => `${session.name}`
    );

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
        <View
            style={{
                backgroundColor: colors.schemes.light.background
            }}
        >
            {showDisclosure === "View" &&
                <DisclosureView
                    options={[
                        ["aggregate", "Aggregate"],
                        ["individual", "Individual"]
                    ]}
                    value={view}
                    onChange={setView}
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Students" &&
                <DisclosureStudents
                    value={studentIDs}
                    onChange={(id: number) => {
                        if (studentIDs.includes(id))
                            setStudentIDs([...studentIDs, id]);
                        else
                            setStudentIDs(studentIDs.splice(studentIDs.indexOf(id), 0))
                    }}
                    onSelectAll={() => setStudentIDs(studentSearchBar.filtered.map(s => s.id))}
                    onDeselectAll={() => setStudentIDs([])}
                    searchBar={studentSearchBar}
                    onClose={closeDisclosure}
                    className="U12 Boys A-Team"
                />
            }
            {showDisclosure === "Range" &&
                <DisclosureRange
                    startDate={startDate}
                    endDate={endDate}
                    onChangeEndDate={setEndDate}
                    onChangeStartDate={setStartDate}
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Metric" &&
                <DisclosureMetric
                    options={[
                        ["accuracy", "Accuracy", "Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
                        ["duration", "Duration", "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
                    ]}
                    value={metric}
                    onChange={setMetric}
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Category" &&
                <DisclosureCategory
                    options={[
                        ["drills", "Drills"],
                        ["workouts", "Workouts"]
                    ]}
                    value={category}
                    onChange={setCategory}
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Instances" &&
                <DisclosureInstances
                    value={instances}
                    onChange={(id: number) => {
                        if (instances.includes(id))
                            setInstances([...instances, id]);
                        else
                            setInstances(instances.splice(instances.indexOf(id), 0));
                    }}
                    onSelectAll={() => setInstances((category === "drills" ? drillSearchBar : sessionSearchBar).filtered.map(s => s.id))}
                    onDeselectAll={() => setInstances([])}
                    onClose={closeDisclosure}
                    searchBar={category === "drills" ? drillSearchBar : sessionSearchBar}
                />
            }
            <View
                style={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    flexDirection: "row",
                    columnGap: padding.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <CardMetric
                    label="Avg. Score"
                    labelStyle={{
                        color: "#307351"
                    }}
                    value="7/10"
                    valueIcon={
                        <MoveUp
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
                        <MoveDown
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
                        color: colors.schemes.light.onSurface
                    }}
                    value="43s"
                />
            </View>
            <View>
                <View>
                    <LineChart 
                        disableScroll={true} 
                        backgroundColor={"white"}
                        width={Dimensions.get("screen").width}
                        adjustToWidth
                        height={300}
                        parentWidth={Dimensions.get("screen").width}
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
                        yAxisColor={colors.schemes.light.outlineVariant}
                        showVerticalLines
                        verticalLinesColor={colors.schemes.light.outlineVariant}
                        xAxisColor={colors.schemes.light.outlineVariant}
                        color={"#1a1ac2"}
                        color2={"#3877ff"}
                        dataPointsColor="black"
                        // curved={true}
                        // curveType={CurveType.QUADRATIC}
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
                        startFillColor={colors.coreColors.primary}
                        endFillColor={colors.coreColors.primary}
                        startOpacity={0.4}
                        endOpacity={0.1}
                        showDataPointLabelOnFocus={false}
                        focusEnabled={false}
                        showStripOnFocus={false}
                        showTextOnFocus={false}
                        // focusedDataPointShape="square"
                    />
                </View>
                <View
                    style={{
                        marginHorizontal: margin.sm,
                        marginVertical: margin.sm,
                        marginTop: margin.sm - 4,
                    }}
                >
                    <DisclosureButton
                        label="View"
                        value={view.charAt(0).toUpperCase() + view.substring(1)}
                        level="top"
                        onDisclose={() => setShowDisclosure("View")}
                    />
                    <DisclosureButton
                        label="Students"
                        value={studentIDs.length === props.students.length ? "All" : (studentIDs.length === 0 ? "None Selected" : `${studentIDs.length} Selected`)}
                        level="middle"
                        onDisclose={() => setShowDisclosure("Students")}
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
                        value={category === "drill" ? (instances.length === props.drills.length ? "All" : (instances.length === 0 ? "None Selected" : `${instances.length} Selected`)) : ((instances.length === props.sessions.length ? "All" : (instances.length === 0 ? "None Selected" : `${instances.length} Selected`)))}
                        level="bottom"
                        onDisclose={() => setShowDisclosure("Instances")}
                    />
                </View>
            </View>
        </View>
    )
}