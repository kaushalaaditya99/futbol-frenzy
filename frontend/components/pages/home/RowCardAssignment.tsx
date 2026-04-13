import { colors } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";
import { Assignment } from "@/services/assignments";

interface RowCardAssignmentProps extends Assignment {
    showTag?: boolean;
}

export default function RowCardAssignment(props: RowCardAssignmentProps) {
    return (
        <RowCard
            onPress={() => 1}
            title={props.workout.workoutName}
            imageText={props["imageText"]}
            imageTextColor={"black"}
            imageBackgroundColor={props["imageBackgroundColor"]}
            descriptions={[
                props.workout.workoutType,
            ]}
        />
    )
}