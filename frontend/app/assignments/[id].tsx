import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import HeaderWithBack from '@/components/ui/HeaderWithBack';
import CoachView from '@/components/pages/assignments/CoachView';
import StudentView from '@/components/pages/assignments/StudentView';
import { View } from 'react-native';
import ThemedText from '@/components/ui/ThemedText';
import { useCallback, useEffect, useState } from 'react';
import { Assignment, getAssignment, getClassByAssignment } from '@/services/assignments';
import { Class } from '@/services/classes';
import { useFocusEffect } from '@react-navigation/native';

export default function Page() {
    const { role, token, loaded } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [assignment, setAssignment] = useState<Assignment>();
    const [assignmentClass, setAssignmentClass] = useState<Class>();

    const loadData = useCallback(async () => {
        if (!token) return;
        const assignmentData = await getAssignment(token, Number(id));
        if (assignmentData) setAssignment(assignmentData);

        const classData = await getClassByAssignment(token, Number(id));
        if (classData) setAssignmentClass(classData);
    }, [token, id]);

    useEffect(() => { loadData(); }, []);

    // Refresh when screen regains focus (e.g. student submitted while coach was away)
    useFocusEffect(useCallback(() => { loadData(); }, [loadData]));
    
    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.background
            }}
        >
            <HeaderWithBack
                header='Assignment'
                subHeader={
                    <View>
                        <ThemedText
                            style={{
                                fontSize: 16,
                                letterSpacing: theme.letterSpacing.xl * 1,
                                color: theme.colors.schemes.light.onSurfaceVariant
                            }}
                        >
                            {assignment?.workout.workoutName} due {assignment?.dueDate.toLocaleDateString('en-US', {'month': 'long', 'day': '2-digit', 'year': 'numeric'})}
                        </ThemedText>
                    </View>
                }
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                    borderBottomWidth: 1,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            {role === 'Coach' &&
                <CoachView
                    assignmentID={parseInt(id)}
                    assignment={assignment}
                    assignmentClass={assignmentClass}
                />
            }
            {role !== 'Coach' &&
                <StudentView
                    assignmentID={parseInt(id)}
                />
            }
        </SafeAreaView>
    )
}
