import { padding } from "@/theme";
import Button from "../Button";
import { Plus } from "lucide-react-native";
import ThemedText from "../ThemedText";

interface CreateClassButtonProps {
    onPress: () => void;
}

export default function CreateClassButton(props: CreateClassButtonProps) {
    return (
        <Button
            onPress={props.onPress}
            borderColor="black"
            tintColor="#646464f0"
            backgroundColor="black"
            style1={{
                flex: 0,
                alignSelf: "flex-start",
                borderRadius: 8,
            }}
            style2={{
                flex: 0,
                alignSelf: "flex-start",
                borderRadius: 8,
            }}
            style3={{
                paddingVertical: padding.sm,
                paddingHorizontal: padding.lg,
                flex: 0,
                alignSelf: "flex-start",
                borderRadius: 6,
            }}
        >
            <Plus
                size={14}
                strokeWidth={2.5}
                color="white"
            />
            <ThemedText
                style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white"
                }}
            >
                Create Class
            </ThemedText>
        </Button>
    )
}