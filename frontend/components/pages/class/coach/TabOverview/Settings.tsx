import HeaderWithCloseSpacious from "@/components/ui/HeaderWithCloseSpacious";
import { theme } from "@/theme";
import { View, Modal } from "react-native";

interface SettingsProps {
    onClose: () => void;
}

export default function Settings(props: SettingsProps) {
    return (
        <Modal
            visible={true} 
            transparent={true} 
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#00000020"
                }}
            >
                <View
                    style={{
                        height: 400,
                        marginTop: 144,
                        marginHorizontal: theme.margin.sm,
                        padding: theme.margin.sm,
                        backgroundColor: theme.colors.schemes.light.surface,
                        borderRadius: theme.borderRadius.base
                    }}
                >
                    <HeaderWithCloseSpacious
                        header="Settings"
                        onClose={props.onClose}
                    />
                </View>
            </View>
        </Modal>
    )
}