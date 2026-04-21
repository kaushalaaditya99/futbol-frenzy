import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import SimpleButton from "@/components/ui/button/SimpleButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, Submission } from "@/services/assignments";
import { getSubmission } from "@/services/submissions";
import { User } from "@/services/user";
import { borderRadius, colors, letterSpacing, shadow, theme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface ViewProps {
    student?: User;
    assignment?: Assignment;
    submission?: Submission;
    submissionID?: number;
}

interface DrillVideoItemProps {
    drill: Submission['submitted_drills'][0];
    i: number;
}

function DrillVideoItem({ drill, i }: DrillVideoItemProps) {
    const player = useVideoPlayer(drill.videoURL, player => {
        player.loop = false;
    });

    return (
        <View 
            style={{
                position: 'relative',
                paddingVertical: theme.margin.xs,
                rowGap: theme.padding.md,
                borderTopWidth: 1,
                borderBottomWidth: i % 2,
                borderColor: theme.colors.schemes.light.outlineVariant
            }}    
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
            >
                <View>
                    <ThemedText
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: theme.letterSpacing.sm,
                        }}
                    >
                        Drill {i + 1}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 17,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.base,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {drill.drill.drillName}
                    </ThemedText>
                </View>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1000,
                        borderWidth: 1,
                        borderStyle: drill.grade === null ? 'dashed' : 'solid',
                        borderColor: drill.grade === null ? theme.colors.schemes.light.outlineVariant : drill.grade > 80 ? '#32a852' : drill.grade > 60 ? '#e0a928' : '#e02828',
                        backgroundColor: drill.grade === null ? '' : drill.grade > 80 ? '#32a852' : drill.grade > 60 ? '#e0a928' : '#e02828'
                    }}
                >
                    <LinearGradient
                        colors={[
                            drill.grade === null ? '' : drill.grade > 80 ? '#ffffff' : drill.grade > 60 ? '#ffffff' : '#ffffff',
                            drill.grade === null ? '' : drill.grade > 80 ? '#b1f0c2' : drill.grade > 60 ? '#fff18a' : '#ffc1c1'
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 1000,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{
                                width: 36,
                                height: 36,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 1000,
                                backgroundColor: drill.grade === null ? '' : drill.grade > 80 ? "#b1f0c2" : drill.grade > 60 ? '#fff18a' : '#ffc1c1'
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    letterSpacing: -0.1,
                                    textAlignVertical: 'center',
                                    color: drill.grade === null ? '' : drill.grade > 80 ? '#32a852' : drill.grade > 60 ? '#e0a928' : '#e02828',
                                }}
                            >
                                {drill.grade}
                            </ThemedText>
                        </View>
                    </LinearGradient>
                </View>
            </View>
            <View
                style={{
                    position: 'relative',
                    borderRadius: theme.borderRadius.base,
                    ...theme.shadow.sm
                }}
            >
                <VideoView
                    player={player}
                    style={{ 
                        width: '100%', 
                        height: 300,
                        borderWidth: 1,
                        borderRadius: theme.borderRadius.base,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: 'white',
                    }}
                />
            </View>
            <View
                style={{
                    backgroundColor: theme.colors.schemes.light.surfaceContainerHigh,
                    padding: 8,
                    paddingHorizontal: 8,
                    borderRadius: borderRadius.base
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 14,
                        letterSpacing: letterSpacing.xl,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: colors.schemes.light.onSurfaceVariant,
                            letterSpacing: letterSpacing.lg
                        }}
                    >
                        Coach's Feedback {' '}
                    </ThemedText>
                    {drill.feedback}
                </ThemedText>
            </View>
        </View>
    );
}

export default function CoachView(props: ViewProps) {
    return (
        <ScrollView>
            <View
                style={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.xs,
                }}
            >
                <View
                    style={{
                        marginBottom: 6
                    }}
                >
                    <View
                        style={{
                            height: 90,
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            backgroundColor: 'white',
                            borderRadius: theme.borderRadius.base,
                            ...theme.shadow.sm
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                height: 86,
                                marginHorizontal: 1,
                                padding: theme.padding.md,
                                flexShrink: 1,
                                borderRadius: theme.borderRadius.base - 2,
                                backgroundColor: theme.colors.schemes.light.surfaceContainer,
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 64,
                                    fontWeight: 500,
                                    color: (props.submission?.grade === null || props.submission?.grade === undefined) ? '' : props.submission?.grade as any > 80 ? '#56be74' : props.submission?.grade as any > 60 ? '#efbc47' : '#e02828'
                                }}
                            >
                                {!([null, undefined] as any).includes(props.submission?.grade) ? `${props.submission?.grade}%` : `--`}
                            </ThemedText>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        padding: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 12,
                        marginBottom: 6,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderRadius: theme.borderRadius.base,
                        borderWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: 'white',
                        ...shadow.sm
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Date Submitted
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {!props.submission?.dateSubmitted ? 'Not Submitted' : new Date(props.submission.dateSubmitted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)/, (d) => `${d}${['th','st','nd','rd'][((+d%100)-10)%10>2?0:+d%10]||'th'}`)}
                    </ThemedText>
                </View>
                <View
                    style={{
                        padding: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderRadius: theme.borderRadius.base,
                        borderWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: 'white',
                        ...shadow.sm
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Date Graded
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {!props.submission?.dateGraded ? 'Not Graded' : new Date(props.submission.dateGraded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)/, (d) => `${d}${['th','st','nd','rd'][((+d%100)-10)%10>2?0:+d%10]||'th'}`)}
                    </ThemedText>
                </View>
            </View>
            <View
                style={{
                    paddingHorizontal: theme.margin.xs,
                }}
            >
                {props.submission?.submitted_drills.map((drill, i) => (
                    <DrillVideoItem key={i} drill={drill} i={i} />
                ))}
                <Button
                    onPress={() => props.submission?.dateSubmitted && router.push({
                        pathname: `/gradeSubmission/[id]`,
                        params: { 
                            id: -1,
                            submissionID: props.submissionID, 
                            // assignmentID: props.assignment.id, 
                            // studentID: submission.student.id 
                        }
                    })}
                    disabled={!props.submission?.dateSubmitted}
                    {...(props.submission?.dateSubmitted ? buttonTheme.blue : buttonTheme.disabled)}
                    outerStyle={{
                        marginVertical: props.submission?.submitted_drills.length ? theme.margin.xs : 0
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 18,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: !props.submission?.dateSubmitted ? '#CCC' : 'white'
                        }}
                    >
                        {props.submission?.dateGraded ? 'Grade Again' : 'Grade'}
                    </ThemedText>
                </Button>
            </View>
        </ScrollView>
    )
}