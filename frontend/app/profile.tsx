import { useAuth } from '@/contexts/AuthContext';
import CoachView from '@/components/pages/profile/coach/CoachView';
import StudentView from '@/components/pages/profile/student/StudentView';

export default function Profile() {
    const { role } = useAuth();

    return (
        <>
            {role === "Coach" &&
                <CoachView/>
            }
            {role !== "Coach" &&
                <StudentView/>
            }
        </>
    )
}