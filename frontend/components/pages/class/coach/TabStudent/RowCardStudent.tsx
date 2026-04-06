import RowCard from "@/components/ui/RowCard";
import { Student } from "@/services/students";

interface RowCardStudent extends Student {}

export default function RowCardStudent(props: RowCardStudent) {
    return (
        <RowCard
            onPress={() => console.log("Clicked")}
            title={`${props.first_name} ${props.last_name}`}
            descriptions={[
                props.position
            ]}
            imageText={`${props.first_name.charAt(0)}${props.last_name.charAt(0)}`}
            imageTextColor="black"
            imageBackgroundColor="lightgray"
        />
    )
}
