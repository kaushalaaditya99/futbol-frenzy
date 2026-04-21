import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, deleteAssignment, getAssignment, getClassByAssignment, Submission } from "@/services/assignments";
import { Class } from "@/services/classes";
import { theme } from "@/theme";
import { ArrowRight, ArrowRightIcon, BookCheckIcon, CheckCircleIcon, ClipboardCheckIcon, Trash2Icon, ZapIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import useSubmissionSearch from "../workouts/useAssignmentSubmissionSearch";
import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import SortButton from "./SortButton";
import SearchBar from "@/components/ui/SearchBar";
import SimpleButton from "@/components/ui/button/SimpleButton";
import IconButton from "@/components/ui/button/IconButton";
import { buttonTheme } from "@/components/ui/button/buttonTheme";

interface CoachViewProps {
    assignmentID: number;
    assignment: Assignment;
    assignmentClass: Class;
}

export default function CoachView(props: CoachViewProps) {
    const { token } = useAuth();
    const [extendedSubmissions, setExtendedSubmissions] = useState<Submission[]>([]);
    const submissionSearch = useSubmissionSearch(extendedSubmissions);

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
                    dateGraded: null as any,
                    dateSubmitted: null as any,
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
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    columnGap: theme.padding.md,
                    backgroundColor: 'white',
                    paddingVertical: theme.padding.md,
                    paddingHorizontal: theme.padding.md,
                    borderBottomWidth: 1, 
                    borderColor: theme.colors.schemes.light.outlineVariant,
                }}
            >
                <IconButton
                    {...buttonTheme.blue}
                    outerStyle={{
                        height: 32,
                        maxHeight: 32,
                        minHeight: 32,
                        aspectRatio: 1
                    }}
                    onPress={() => {
                        if (!token)
                            return;
                        router.push({
                            'pathname': '/workouts/[id]',
                            params: {
                                'id': props.assignment.workout.id
                            }
                        })
                    }}
                >
                    <ZapIcon
                        color="#fff"
                        size={16}
                    />
                </IconButton>
                <IconButton
                    {...buttonTheme.white}
                    outerStyle={{
                        height: 32,
                        maxHeight: 32,
                        minHeight: 32,
                        aspectRatio: 1
                    }}
                    backgroundColor="#e63a3a"
                    tintColor="#ffffff6a"
                    tintUpsideDown={false}
                    borderColor="#e43131"
                    onPress={async () => {
                        if (!token)
                            return;
                        await deleteAssignment(token, props.assignmentID);
                        router.back();
                    }}
                >
                    <Trash2Icon
                        size={18}
                        color='#fff'
                    />
                </IconButton>
            </View>
            <View
                style={{
                    paddingVertical: theme.padding.md,
                    paddingHorizontal: theme.padding.md,
                    flex: 1,
                    rowGap: theme.padding.md,
                    borderBottomWidth: 1,
                    borderStyle: "dashed",
                    borderColor: theme.colors.schemes.light.outlineVariant,
                    backgroundColor: theme.colors.schemes.light.surfaceContainerLow
                }}
            >
                <View
                    style={{
                        rowGap: theme.padding.md
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            columnGap: theme.padding.md
                        }}
                    >
                        <InputDropdownV2
                            value={submissionSearch.grade}
                            onChange={submissionSearch.setGrade}
                            options={submissionSearch.gradeOptions as any}
                            buttonStyle={{
                                borderRadius: 8,
                                height: 36,
                                minHeight: 36,
                                maxHeight: 36,
                                paddingHorizontal: theme.padding.lg,
                            }}
                        />
                        <InputDropdownV2
                            value={submissionSearch.submit}
                            onChange={submissionSearch.setSubmit}
                            options={submissionSearch.submittedOptions as any}
                            buttonStyle={{
                                borderRadius: 8,
                                height: 36,
                                minHeight: 36,
                                maxHeight: 36,
                                paddingHorizontal: theme.padding.lg,
                            }}
                        />
                    </View>
                    <SearchBar
                        search={submissionSearch.search}
                        setSearch={submissionSearch.setSearch}
                        placeholder="Search Names"
                        enableSort={false}
                        containerStyle={{
                            height: 36,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            columnGap: theme.padding.md,
                        }}
                    >
                        <SortButton
                            searchBar={submissionSearch}
                        />
                    </View>
                </View>
            </View>
            <View
                style={{
                    paddingVertical: theme.padding.md,
                    paddingHorizontal: theme.padding.md,
                    rowGap: theme.padding.md
                }}
            >
                {submissionSearch.filtered.map((submission, i) => (
                    <View key={i}>
                        <RowCard
                            title={`${submission.student.first_name} ${submission.student.last_name}`}
                            onPress={() => router.push({
                                pathname: `/submissions/[id]`,
                                params: { 
                                    submissionID: submission.id, 
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