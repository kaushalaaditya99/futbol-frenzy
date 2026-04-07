import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import BottomScreen, { BottomScreenProps } from "@/components/ui/BottomScreen";
import { Pressable, View } from "react-native";
import { colors, theme } from "@/theme";
import { Check } from "lucide-react-native";
import DisclosureRadioButton from "./DisclosureRadioButton";

interface DisclosureViewProps extends BottomScreenProps {
    value: string;
    options: [string, string][];
    onChange: (value: string) => void; 
}

export default function DisclosureView(props: DisclosureViewProps) {
    return (
        <DisclosureModal
            title="Select View"
            onClose={props.onClose}
        >
            <DisclosureRadioButton
                value={props.value}
                options={props.options}
                onChange={props.onChange}
            />
        </DisclosureModal>
    )
}