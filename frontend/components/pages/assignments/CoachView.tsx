import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, getClassByAssignment, Submission } from "@/services/assignments";
import { Class } from "@/services/classes";
import { theme } from "@/theme";
import { ArrowRight, ArrowRightIcon, BookCheckIcon, CheckCircleIcon, ClipboardCheckIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

interface CoachViewProps {
    assignmentID: number;
    assignment: Assignment;
    assignmentClass: Class;
}

export default function CoachView(props: CoachViewProps) {
    const { token } = useAuth();
    const [extendedSubmissions, setExtendedSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        loadExtendedSubmissions();
    }, [token, props.assignmentClass, props.assignment]);

    const loadExtendedSubmissions = () => {
        if (!props.assignmentClass || !props.assignment)
            return;

        const extendedSubmissions: Submission[] = [];

        for (const student of props.assignmentClass.students) {
            const submission = props.assignment.submissions.find(a => a.studentID === student.id);
            if (submission) {
                extendedSubmissions.push(submission);
            }
            else {
                extendedSubmissions.push({
                    id: -1,
                    studentID: student.id,
                    assignmentID: -1,
                    grade: -1,
                    dateGraded: '',
                    dateSubmitted: '',
                    imageBackgroundColor: '',
                    imageText: '',
                    imageTextColor: '',
                    student: {
                        ...student,
                        username: '',
                        email: ''
                    },
                    submitted_drills: []
                })
            }
        }

        setExtendedSubmissions(extendedSubmissions);
    }


    return (
        <ScrollView>
            <View
                style={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.xs,
                    rowGap: theme.margin.xs
                }}
            >
                {extendedSubmissions.map((submission, i) => (
                    <View key={i}>
                        <RowCard
                            title={`${submission.student.first_name} ${submission.student.last_name}`}
                            onPress={() => router.push({
                                pathname: `/submissions/[id]`,
                                params: { 
                                    id: submission.id, 
                                    assignmentID: props.assignment.id, 
                                    studentID: submission.student.id 
                                }
                            })}
                            descriptions={[submission.dateSubmitted ? 'Submitted' : 'Not Submitted', submission.dateGraded ? 'Graded' : 'Not Graded']}
                            titleTagClose={true}
                            imageText={`${submission.student.first_name[0]}${submission.student.last_name[0]}`}
                            imageBackgroundColor=''
                            imageTextColor=''
                            rightElement={(
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {[null, -1].includes(submission.grade) 
                                        ?
                                        (<View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: 1000,
                                                borderWidth: 1,
                                                borderStyle: 'dashed',
                                                borderColor: theme.colors.schemes.light.outlineVariant,
                                                backgroundColor: theme.colors.schemes.light.background
                                            }}
                                        >
                                           
                                        </View>)
                                        :
                                        (<View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: 1000,
                                                borderWidth: 1,
                                                borderColor: submission.grade > 80 ? '#32a852' : submission.grade > 60 ? '#e0a928' : '#e02828',
                                                backgroundColor: submission.grade > 80 ? '#32a852' : submission.grade > 60 ? '#e0a928' : '#e02828'
                                            }}
                                        >
                                            <LinearGradient
                                                colors={[
                                                    submission.grade > 80 ? '#ffffff' : submission.grade > 60 ? '#ffffff' : '#ffffff',
                                                    submission.grade > 80 ? '#b1f0c2' : submission.grade > 60 ? '#fff18a' : '#ffc1c1'
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
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 1000,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 1000,
                                                        backgroundColor: submission.grade > 80 ? "#b1f0c2" : submission.grade > 60 ? '#fff18a' : '#ffc1c1'
                                                    }}
                                                >
                                                    <ThemedText
                                                        style={{
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                            letterSpacing: -0.1,
                                                            textAlignVertical: 'center',
                                                            color: submission.grade > 80 ? '#32a852' : submission.grade > 60 ? '#e0a928' : '#e02828',
                                                        }}
                                                    >
                                                        {submission.grade}
                                                    </ThemedText>
                                                </View>
                                            </LinearGradient>
                                        </View>)
                                    }
                                </View>
                            )}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}