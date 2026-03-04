import RowCard from "@/components/ui/RowCard";

export default function CardResult(props: {
    name: string;
    date: string;
    type: string;
    score: number;
    imageBackgroundColor: string;
    imageColor: string;
}) {
    return (
        <RowCard
            title={props.name}
            imageText={""+props.score}
            imageTextColor={"black"}
            imageBackgroundColor={"lightgray"}
            descriptions={[
                props.date,
                props.type
            ]}
            onPress={() => 1}
        />
    )
}