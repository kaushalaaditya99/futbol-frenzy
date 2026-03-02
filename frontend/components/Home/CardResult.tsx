import { colors, shadow } from "@/theme";
import { View } from "react-native";
import ThemedText from "../ThemedText";
import RowCardWrapper from "../RowCardWrapper";

export default function CardResult(props: {
    name: string;
    date: string;
    type: string;
    score: number;
    imageBackgroundColor: string;
    imageColor: string;
}) {
    return (
        <RowCardWrapper
            title={props.name}
            imageBackgroundColor={"lightgray"}
            imageTextColor={"black"}
            imageText={""+props.score}
            descriptions={[
                props.date,
                props.type
            ]}
            onPress={() => 1}
        />
    )
}