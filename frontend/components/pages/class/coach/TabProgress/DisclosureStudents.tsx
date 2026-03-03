import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureStudents(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select Students"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}