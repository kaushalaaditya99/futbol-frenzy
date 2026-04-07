import { colors, margin, padding } from "@/theme";
import { Dimensions, View } from "react-native";
import CardMetric from "../../../CardMetric";
import { MoveDown, MoveUp } from "lucide-react-native";
import { LineChart } from "react-native-gifted-charts";
import DisclosureButton from "../../coach/TabProgress/DisclosureButton";
import { useState } from "react";
import DisclosureRange from "../../coach/TabProgress/DisclosureRange";
import DisclosureMetric from "../../coach/TabProgress/DiscolsureMetric";
import DisclosureCategory from "../../coach/TabProgress/DisclosureCategory";
import DisclosureInstances from "../../coach/TabProgress/DisclosureInstances";

export default function StudentTabProgress() {
    const lineData = [
        { value: 0 },
        { value: 15 },
        { value: 22 },
        { value: 40 },
        { value: 55 },
        { value: 60 },
        { value: 72 },
        { value: 85 },
    ];

    const [showDisclosure, setShowDisclosure] = useState("");

    const closeDisclosure = () => {
        setShowDisclosure("");
    };

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background,
            }}
        >
            {showDisclosure === "Range" && (
                <DisclosureRange onClose={closeDisclosure} />
            )}
            {showDisclosure === "Metric" && (
                <DisclosureMetric onClose={closeDisclosure} />
            )}
            {showDisclosure === "Category" && (
                <DisclosureCategory onClose={closeDisclosure} />
            )}
            {showDisclosure === "Instances" && (
                <DisclosureInstances onClose={closeDisclosure} />
            )}
            <View
                style={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    flexDirection: "row",
                    columnGap: padding.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                }}
            >
                <CardMetric
                    label="My Avg. Score"
                    labelStyle={{
                        color: "#307351",
                    }}
                    value="8.2/10"
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
                    label="Completion"
                    labelStyle={{
                        color: "#307351",
                    }}
                    value="90%"
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
                    label="Avg. Duration"
                    labelStyle={{
                        color: colors.schemes.light.onSurface,
                    }}
                    value="38s"
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
                        thickness={1}
                        hideYAxisText
                        yAxisThickness={0}
                        xAxisIndicesHeight={0}
                        xAxisIndicesWidth={0}
                        xAxisLabelsAtBottom={false}
                        yAxisLabelWidth={0}
                        xAxisLabelsHeight={0}
                        yAxisColor={colors.schemes.light.outlineVariant}
                        showVerticalLines
                        verticalLinesColor={colors.schemes.light.outlineVariant}
                        xAxisColor={colors.schemes.light.outlineVariant}
                        color={colors.coreColors.primary}
                        dataPointsColor="black"
                        isAnimated={true}
                        animateOnDataChange
                        animationDuration={1000}
                        onDataChangeAnimationDuration={300}
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
                        label="Range"
                        value="Last 30 Days"
                        level="top"
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
    );
}
