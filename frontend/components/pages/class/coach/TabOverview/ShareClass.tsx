import { Share, Alert } from "react-native";

interface ShareClassProps {
    classCode?: string;
    onClose?: () => void;
}

export async function shareClassCode(classCode: string) {
    try {
        await Share.share({
            message: `Join my class on DrillUp! Use code: ${classCode}`,
        });
    } catch (error) {
        Alert.alert("Error", "Failed to open share sheet.");
    }
}

// Keep component for backward compatibility with existing usage
export default function ShareClass(props: ShareClassProps) {
    shareClassCode(props.classCode || "").then(() => {
        props.onClose?.();
    });
    return null;
}
