import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureInstances(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select Instances"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}