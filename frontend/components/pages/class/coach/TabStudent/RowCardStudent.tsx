import RowCard from "@/components/ui/RowCard";
import { Student } from "@/services/students";

interface RowCardStudent extends Student {}

export default function RowCardStudent(props: RowCardStudent) {
    return (
        <RowCard
            onPress={() => console.log("Clicked")}
            title={`${props.fName} ${props.lName}`}
            descriptions={[
                props.position
            ]}
            imageText={`${props.fName.charAt(0)}${props.lName.charAt(0)}`}
            imageTextColor="black"
            imageBackgroundColor="lightgray"
        />
    )
}