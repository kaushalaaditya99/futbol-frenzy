import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureView(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select View"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}