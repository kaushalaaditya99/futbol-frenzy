import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import { BottomScreenProps } from "@/components/ui/BottomScreen";
import DisclosureRadioButton from "./DisclosureRadioButton";

interface DisclosureCategoryProps extends BottomScreenProps {
    value: string;
    options: [string, string][];
    onChange: (value: string) => void; 
}

export default function DisclosureCategory(props: DisclosureCategoryProps) {
    return (
        <DisclosureModal
            title="Select Category"
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