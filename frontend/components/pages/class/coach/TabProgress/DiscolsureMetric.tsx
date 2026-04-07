import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import { BottomScreenProps } from "@/components/ui/BottomScreen";
import DisclosureRadioButton from "./DisclosureRadioButton";

interface DisclosureMetricProps extends BottomScreenProps {
    value: string;
    options: [string, string, string?][];
    onChange: (value: string) => void; 
}

export default function DisclosureMetric(props: DisclosureMetricProps) {
    return (
        <DisclosureModal
            title="Select Metric"
            onClose={props.onClose}
        >
            <DisclosureRadioButton
                value={props.value}
                options={props.options}
                onChange={props.onChange}
                description={true}
            />
        </DisclosureModal>
    )
}