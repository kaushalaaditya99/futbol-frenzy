import { Class } from "@/services/classes";
import { router } from "expo-router";
import RowCardWrapper from "../RowCardWrapper";

interface CardClassProps extends Class {}

export default function CardClass(props: CardClassProps) {
    return (
        <RowCardWrapper
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