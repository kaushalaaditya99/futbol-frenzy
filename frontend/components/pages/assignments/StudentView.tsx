import ThemedText from "@/components/ui/ThemedText";

interface StudentViewProps {
    assignmentID: number;
}

export default function StudentView(props: StudentViewProps) {
    return (
        <>
            <ThemedText>
                Student
            </ThemedText>
        </>
    )
}