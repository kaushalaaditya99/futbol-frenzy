import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureCategory(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select Category"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}