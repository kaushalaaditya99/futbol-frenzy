import { borderRadius, colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { Modal, View } from "react-native";
import ThemedText from "../ThemedText";
import useLocalFonts from "@/hooks/useFonts";
import ButtonExit from "../button/ButtonExit";
import Calendar, { CalendarProps } from "./Calendar";

interface ModalCalendarProps extends CalendarProps {
    closeCalendar: () => void;
}

export default function ModalCalendar(props: ModalCalendarProps) {
    const fonts = useLocalFonts();

    if (!fonts.fontsLoaded)
        return null;
    
    return (
        <Modal
            visible={true} 
            transparent={true} 
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#000000DA"
                }}
            >
                <View
                    style={{
                        height: 400,
                        marginTop: 144,
                        marginHorizontal: margin.sm,
                        backgroundColor: colors.schemes.light.surface,
                        borderRadius: borderRadius.base
                    }}
                >
                    <View
                        style={{
                            paddingVertical: padding.lg,
                            paddingHorizontal: padding.lg,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderTopLeftRadius: borderRadius.base,
                            borderTopRightRadius: borderRadius.base,
                            backgroundColor: colors.schemes.light.surfaceContainer
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                fontWeight: 500,
                                letterSpacing: letterSpacing.md,
                                color: colors.schemes.light.onSurface
                            }}
                        >
                            Calendar
                        </ThemedText>
                        <ButtonExit
                            onExit={props.closeCalendar}
                        />
                    </View>
                    <Calendar
                        onDayPress={props.onDayPress}
                        markedDates={props.markedDates}
                        markingType={props.markingType}
                        theme={props.theme}
                        style={props.style}
                    />
                </View>
            </View>
        </Modal>
    )
}