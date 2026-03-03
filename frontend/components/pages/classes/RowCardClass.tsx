import RowCard from "@/components/ui/RowCard";
import { Class } from "@/services/classes";
import { router } from "expo-router";

interface RowCardClassProps extends Class {}

export default function RowCardClass(props: RowCardClassProps) {
    return (
        <RowCard
            title={props.name}
            imageBackgroundColor={props.imageBackgroundColor || "lightgray"}
            imageTextColor={props.imageTextColor || "black"}
            imageText={props.imageText}
            descriptions={[
                `Coach ${props.teacherName}`, 
                `${props.numStudents} students`
            ]}
            onPress={() => router.push('/class')}
        />
    )
}