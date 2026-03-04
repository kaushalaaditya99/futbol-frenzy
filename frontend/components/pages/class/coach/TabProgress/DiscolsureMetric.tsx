import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal, { BottomScreenProps } from "./DisclosureModal";

export default function DisclosureMetric(props: BottomScreenProps) {
    return (
        <DisclosureModal
            title="Select Metric"
            onClose={props.onClose}
        >
        </DisclosureModal>
    )
}