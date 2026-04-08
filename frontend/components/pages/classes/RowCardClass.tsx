import RowCard from "@/components/ui/RowCard";
import { Class } from "@/services/classes";
import { router } from "expo-router";

interface RowCardClassProps extends Partial<Class> {}

export default function RowCardClass(props: RowCardClassProps) {
    return (
        <RowCard
            title={props.className || ""}
            imageBackgroundColor={props.imageBackgroundColor || "lightgray"}
            imageTextColor={props.imageTextColor || "black"}
            imageText={props.imageText || ""}
            descriptions={[
                `Coach ${props.coach?.last_name}`,
                `${props.students?.length} students`
            ]}
            onPress={() => router.push(`/classes/${props.id}`)}
        />
    )
}
