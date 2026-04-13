import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { Assignment, getAssignment, getClassByAssignment } from "@/services/assignments";
import { Class } from "@/services/classes";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

interface CoachViewProps {
    assignmentID: number;
}

export default function CoachView(props: CoachViewProps) {
    const { token } = useAuth();
    const [soccerClass, setSoccerClass] = useState<Class>();
    const [assignment, setAssignment] = useState<Assignment>();

    useEffect(() => {
        loadAssignment();
    }, [token]);

    const loadAssignment = async () => {
        if (!token)
            return;
        const assignment = await getAssignment(token, props.assignmentID);
        if (!assignment)
            return;
        // console.log(assignment);
        setAssignment(assignment);

        const soccerClass = await getClassByAssignment(token, props.assignmentID);
        console.log('Here Not');
        if (!soccerClass)
            return;
        console.log('Here');
        console.log(soccerClass);
        setSoccerClass(soccerClass);
    }

    return (
        <ScrollView>
            {soccerClass && soccerClass.students.map((student, i) => (
                <View key={i}>
                    <RowCard
                        title="ok"
                        onPress={() => null}
                        descriptions={[]}
                        imageText=""
                        imageBackgroundColor=""
                        imageTextColor=""
                    />
                </View>
            ))}
            {/* {assignment?.submissions && assignment.submissions.map((submission, i) => (
                <View key={i}>
                    <ThemedText>
                        {JSON.stringify(submission)} ok
                    </ThemedText>
                </View>
            ))} */}
        </ScrollView>
    )
}