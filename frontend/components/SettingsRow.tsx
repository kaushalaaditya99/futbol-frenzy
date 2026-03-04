import { Text, View } from "react-native";
import { LucideIcon, ChevronRight } from "lucide-react-native";

interface SettingsRowProps {
    icon: LucideIcon;
    label: string;
    rightText?: string;
}

export default function SettingsRow({ icon: Icon, label, rightText }: SettingsRowProps) {
    
    return (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 }}>
            <Icon size={20} color="#555" style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, flex: 1 }}>{label}</Text>
            {rightText && <Text style={{ fontSize: 16, color: "gray", marginRight: 4 }}>{rightText}</Text>}
            <ChevronRight size={18} color="#CCC" />
        </View>
    );
}