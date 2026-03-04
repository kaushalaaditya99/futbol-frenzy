import BottomScreen, { BottomScreenProps } from "@/components/ui/BottomScreen";
import ButtonExit from "@/components/ui/button/ButtonExit";
import ThemedText from "@/components/ui/ThemedText";
import { fontSize, letterSpacing, margin } from "@/theme";
import { ReactNode } from "react"
import { Dimensions, Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DisclosureModal(props: BottomScreenProps) {
    return (
        <BottomScreen
            {...props}
        />
    )
}