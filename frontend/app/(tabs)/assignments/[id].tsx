import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import HeaderWithBack from '@/components/ui/HeaderWithBack';
import CoachView from '@/components/pages/assignments/CoachView';
import StudentView from '@/components/pages/assignments/StudentView';

export default function Page() {
    const { role, token, loaded } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    
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
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                    borderBottomWidth: 0,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            {role === 'Coach' &&
                <CoachView
                    assignmentID={parseInt(id)}
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
