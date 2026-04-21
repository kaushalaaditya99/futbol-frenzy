import { Assignment, Submission } from "@/services/assignments";
import { User } from "@/services/user";

interface ViewProps {
    student?: User;
    submissionID?: number;
    assignment?: Assignment;
    submission?: Submission;
}

export default function StudentView(props: ViewProps) {
    return (
        <>
        </>
    )
}