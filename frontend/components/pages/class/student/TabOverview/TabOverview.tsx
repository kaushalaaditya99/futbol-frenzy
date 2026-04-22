import { View } from "react-native";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import CardMetric from "@/components/pages/CardMetric";
import ThemedText from "@/components/ui/ThemedText";
import ProgressBar from "./ProgressBar";
import FeedbackCard from "./FeedbackCard";
import NextSessionCard from "./NextSessionCard";
import { Divider } from "@/components/Common";

interface StudentTabOverviewProps {
    sessionsCompleted: number;
    sessionsTotal: number;
    classAvg: string;
    classAvgTrend: string;
    feedbacks: {
        drillName: string;
        drillEmoji: string;
        sessionLabel: string;
        score: number;
        maxScore: number;
        coachName: string;
        coachInitials: string;
        feedback: string;
    }[];
    nextSession: {
        name: string;
        dueLabel: string;
        drills: { name: string; duration: string }[];
    } | null;
    onStartSession?: () => void;
}

export default function StudentTabOverview(props: StudentTabOverviewProps) {
    const completionPct = props.sessionsTotal > 0
        ? Math.round((props.sessionsCompleted / props.sessionsTotal) * 100)
        : 0;

    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background,
            }}
        >
            {/* Stats Row */}
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.sm,
                    flexDirection: "row",
                    columnGap: padding.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                }}
            >
                <CardMetric
                    label="Class Avg"
                    value={props.classAvg}
                    valueIcon={
                        <ThemedText
                            style={{
                                fontSize: fontSize.xs,
                                fontWeight: "600",
                                color: colors.coreColors.tertiary,
                            }}
                        >
                            {props.classAvgTrend}
                        </ThemedText>
                    }
                    valueIconSide="right"
                />
                <CardMetric
                    label="Completed"
                    value={`${props.sessionsCompleted}/${props.sessionsTotal}`}
                />
                <CardMetric
                    label="Completion"
                    value={`${completionPct}%`}
                />
            </View>

            {/* Content */}
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.sm,
                    rowGap: padding.xl,
                }}
            >
                {/* Class Progress */}
                <ProgressBar
                    label="Class Progress"
                    current={props.sessionsCompleted}
                    total={props.sessionsTotal}
                />
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: colors.schemes.light.outlineVariant
                    }}
                />
                {/* Feedback */}
                {props.feedbacks.length > 0 && (
                    <>
                        <ThemedText
                            style={{
                                fontWeight: "500",
                                fontSize: fontSize.lg,
                                letterSpacing: letterSpacing.xs,
                                color: colors.schemes.light.onBackground,
                            }}
                        >
                            Feedback
                        </ThemedText>
                        {props.feedbacks.map((fb, i) => (
                            <FeedbackCard key={i} {...fb} />
                        ))}
                    </>
                )}
                <View
                    style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: colors.schemes.light.outlineVariant
                    }}
                />
                {/* Next Session */}
                {props.nextSession && (
                    <>
                        <ThemedText
                            style={{
                                fontWeight: "500",
                                fontSize: fontSize.lg,
                                letterSpacing: letterSpacing.xs,
                                color: colors.schemes.light.onBackground,
                            }}
                        >
                            Next Assignment
                        </ThemedText>
                        <NextSessionCard
                            sessionName={props.nextSession.name}
                            dueLabel={props.nextSession.dueLabel}
                            drills={props.nextSession.drills}
                            onStart={props.onStartSession}
                        />
                    </>
                )}
            </View>
        </View>
    );
}
