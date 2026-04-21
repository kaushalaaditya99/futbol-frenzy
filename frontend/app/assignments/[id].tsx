import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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

export default function Page() {
    const { role, token, loaded } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [assignment, setAssignment] = useState<Assignment>();
    const [assignmentClass, setAssignmentClass] = useState<Class>();

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                if (!token)
                    return;
                const assignment = await getAssignment(token, Number(id));
                if (!assignment)
                    return;
                setAssignment(assignment);

                console.log('ID', id);
                const assignmentClass = await getClassByAssignment(token, Number(id));
                if (!assignmentClass)
                    return;
                setAssignmentClass(assignmentClass);
            }
            load();
        }, [])
    );
    
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
            {(assignment && assignmentClass && role === 'Coach') &&
                <CoachView
                    assignmentID={parseInt(id)}
                    assignment={assignment}
                    assignmentClass={assignmentClass}
                />
            }
            {(assignment && assignmentClass && role !== 'Coach') &&
                <StudentView
                    assignmentID={parseInt(id)}
                />
            }
        </SafeAreaView>
    )
}
