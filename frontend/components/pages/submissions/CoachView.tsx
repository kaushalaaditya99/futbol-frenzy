import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import SimpleButton from "@/components/ui/button/SimpleButton";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, Submission } from "@/services/assignments";
import { getSubmission } from "@/services/submissions";
import { borderRadius, shadow, theme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface ViewProps {
    assignment: Assignment;
    submission: Submission;
    submissionID: number;
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
                    <ThemedText
                        style={{
                            marginBottom: 4,
                            fontSize: 13,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        GRADE
                    </ThemedText>
                    <View
                        style={{
                            height: 90,
                            justifyContent: 'center',
                            backgroundColor: props.submission.grade === null ? '' : props.submission.grade > 80 ? '#b1f0c2' : props.submission.grade > 60 ? '#f9ca5d' : '#e02828',
                            borderRadius: theme.borderRadius.base,
                            ...theme.shadow.sm
                        }}
                    >
                        <LinearGradient
                            colors={[
                                props.submission.grade === null ? '' : props.submission.grade > 80 ? '#ffffff' : props.submission.grade > 60 ? '#ffffff' : '#e02828',
                                props.submission.grade === null ? '' : props.submission.grade > 80 ? '#94cfa4' : props.submission.grade > 60 ? '#f9ca5d' : '#e02828'
                            ]}
                            start={{ 
                                x: 0, 
                                y: 0
                            }}
                            end={{ 
                                x: 0, 
                                y: 1
                            }}
                            style={{
                                height: 88,
                                marginHorizontal: 1,
                                justifyContent: 'center',
                                borderRadius: theme.borderRadius.base - 1,
                            }}
                        >
                            <View
                                style={{
                                    height: 86,
                                    marginHorizontal: 1,
                                    padding: theme.padding.md,
                                    flexDirection: 'row',
                                    flexShrink: 1,
                                    borderRadius: theme.borderRadius.base - 2,
                                    backgroundColor: props.submission.grade === null ? '' : props.submission.grade > 80 ? '#d0f8db' : props.submission.grade > 60 ? '#f9ca5d' : '#e02828',
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 64,
                                        fontWeight: 500,
                                        letterSpacing: theme.letterSpacing.xl * -10,
                                        color: props.submission.grade === null ? '' : props.submission.grade > 80 ? '#56be74' : props.submission.grade > 60 ? '#f9ca5d' : '#e02828'
                                    }}
                                >
                                    {props.submission.grade}
                                    <ThemedText
                                        style={{
                                            fontSize: 32,
                                            fontWeight: 500,
                                            letterSpacing: theme.letterSpacing.sm,
                                            color: props.submission.grade === null ? '' : props.submission.grade > 80 ? '#78ce90' : props.submission.grade > 60 ? '#f9ca5d' : '#e02828'
                                        }}
                                    >
                                        {' / 100'}
                                    </ThemedText>
                                </ThemedText>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <ThemedText
                        style={{
                            // fontFamily: 'Silkscreen',
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Submitted on
                    </ThemedText>
                    {/* <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', marginHorizontal: 12, marginBottom: 4, borderColor: theme.colors.schemes.light.outlineVariant }} /> */}
                    <ThemedText
                        style={{
                            // fontFamily: 'Silkscreen',
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {new Date(props.submission.dateSubmitted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)/, (d) => `${d}${['th','st','nd','rd'][((+d%100)-10)%10>2?0:+d%10]||'th'}`)}
                    </ThemedText>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        Graded on
                    </ThemedText>
                    {/* <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dotted', marginHorizontal: 12, marginBottom: 4, borderColor: theme.colors.schemes.light.outlineVariant }} /> */}
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 400,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {new Date(props.submission.dateGraded).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/(\d+)/, (d) => `${d}${['th','st','nd','rd'][((+d%100)-10)%10>2?0:+d%10]||'th'}`)}
                    </ThemedText>
                </View>
            </View>
            <View
                style={{
                    paddingHorizontal: theme.margin.xs,
                }}
            >
                {props.submission.submitted_drills.map((drill, i) => {
                    const player = useVideoPlayer(drill.videoURL, player => {
                        player.loop = false;
                    });

                    return (
                        <View 
                            key={i}
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
                                            // color: theme.colors.schemes.light.onSurface
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
                                        borderColor: drill.grade === null ? '' : drill.grade > 80 ? '#5bcc79' : drill.grade > 60 ? '#e0a928' : '#e02828',
                                        backgroundColor: drill.grade === null ? '' : drill.grade > 80 ? '#32a852' : drill.grade > 60 ? '#e0a928' : '#e02828'
                                    }}
                                >
                                    <LinearGradient
                                        colors={[
                                            drill.grade === null ? '' : drill.grade > 80 ? '#ffffff' : drill.grade > 60 ? '#ffffff' : '#e02828',
                                            drill.grade === null ? '' : drill.grade > 80 ? '#64d181' : drill.grade > 60 ? '#f9ca5d' : '#e02828'
                                        ]}
                                        start={{ 
                                            x: 0, 
                                            y: 0
                                        }}
                                        end={{ 
                                            x: 0, 
                                            y: 1
                                        }}
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
                                                backgroundColor: drill.grade === null ? '' : drill.grade > 80 ? "#b1f0c2" : drill.grade > 60 ? '#ffe5a8' : '#e02828'
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    letterSpacing: -0.1,
                                                    textAlignVertical: 'center',
                                                    color: drill.grade === null ? '' : drill.grade > 80 ? '#32a852' : drill.grade > 60 ? '#c7900e' : '#e02828',
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
                                        // borderStyle: 'dashed',
                                        borderRadius: theme.borderRadius.base,
                                        // borderColor: drill.grade === null ? 'gray' : drill.grade >= 80 ? '#32a852' : drill.grade >= 60 ? '#f4bc3c' : '#e02828',
                                        borderColor: theme.colors.schemes.light.outlineVariant,
                                        backgroundColor: 'white',
                                    }}
                                />
                            </View>
                        </View>
                    )
                })}
                <Button
                    {...buttonTheme.blue}
                    outerStyle={{
                        marginTop: theme.margin.xs
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: 'white'
                        }}
                    >
                        {props.submission.dateGraded ? 'Start Over' : 'Grade'}
                    </ThemedText>
                </Button>
            </View>
        </ScrollView>
    )
}