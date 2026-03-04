import { colors, margin, padding } from "@/theme";
import { Dimensions, View } from "react-native";
import CardMetric from "../../../CardMetric";
import { MoveDown, MoveUp } from "lucide-react-native";
import { LineChart } from "react-native-gifted-charts";
import DisclosureButton from "./DisclosureButton";
import { useState } from "react";
import DisclosureView from "./DisclosureView";
import DisclosureStudents from "./DisclosureStudents";
import DisclosureRange from "./DisclosureRange";
import DisclosureMetric from "./DiscolsureMetric";
import DisclosureCategory from "./DisclosureCategory";
import DisclosureInstances from "./DisclosureInstances";

export default function TabProgress() {
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
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Students" &&
                <DisclosureStudents
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Range" &&
                <DisclosureRange
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Metric" &&
                <DisclosureMetric
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Category" &&
                <DisclosureCategory
                    onClose={closeDisclosure}
                />
            }
            {showDisclosure === "Instances" &&
                <DisclosureInstances
                    onClose={closeDisclosure}
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
                        color2={"#269c26"}
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
                        value="Aggregate"
                        level="top"
                        onDisclose={() => setShowDisclosure("View")}
                    />
                    <DisclosureButton
                        label="Students"
                        value="All"
                        level="middle"
                        onDisclose={() => setShowDisclosure("Students")}
                    />
                    <DisclosureButton
                        label="Range"
                        value="Last 30 Days"
                        level="middle"
                        onDisclose={() => setShowDisclosure("Range")}
                    />
                    <DisclosureButton
                        label="Metric"
                        value="Accuracy"
                        level="middle"
                        onDisclose={() => setShowDisclosure("Metric")}
                    />
                    <DisclosureButton
                        label="Category"
                        value="Drills"
                        level="middle"
                        onDisclose={() => setShowDisclosure("Category")}
                    />
                    <DisclosureButton
                        label="Drill Instances"
                        value="All"
                        level="bottom"
                        onDisclose={() => setShowDisclosure("Instances")}
                    />
                </View>
            </View>
        </View>
    )
}