import BottomScreen, { BottomScreenProps } from "@/components/ui/BottomScreen";

interface ShareClassProps extends BottomScreenProps {
    classCode?: string;
}

export default function ShareClass(props: ShareClassProps) {
    return (
        <BottomScreen
            {...props}
            title="Share Class"
        />
    )
}