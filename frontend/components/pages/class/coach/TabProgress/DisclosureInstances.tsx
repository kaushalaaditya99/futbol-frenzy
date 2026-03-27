import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import { BottomScreenProps } from "@/components/ui/BottomScreen";

interface DisclosureInstancesProps extends BottomScreenProps {
    value: number[];
    options: [number, string][];
    onChange: (value: number) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

export default function DisclosureInstances(props: DisclosureInstancesProps) {
    return (
        <DisclosureModal
            title="Select Instances"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}