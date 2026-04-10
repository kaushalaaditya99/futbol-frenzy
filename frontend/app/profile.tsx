import { useAuth } from '@/contexts/AuthContext';
import CoachView from '@/components/pages/profile/coach/CoachView';
import StudentView from '@/components/pages/profile/student/StudentView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Profile() {
    const { role } = useAuth();

    return (
        <GestureHandlerRootView>
            {role === "Coach" &&
                <CoachView/>
            }
            {role !== "Coach" &&
                <StudentView/>
            }
        </GestureHandlerRootView>
    )
}