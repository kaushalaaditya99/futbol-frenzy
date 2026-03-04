import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureRange(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select Range"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}