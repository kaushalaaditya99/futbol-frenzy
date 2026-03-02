import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { Modal, Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { useFonts } from "@expo-google-fonts/lato";
import useLocalFonts from "@/hooks/useFonts";
import ButtonExit from "../ButtonExit";

interface ModalCalendarProps {
    date: Date;
    setDateStart: (start: Date) => void;
    setDateOffset: (offset: number) => void;
    showCalendar: boolean;
    setShowCalendar: (b: boolean) => void;
}

export default function ModalCalendar(props: ModalCalendarProps) {
    const fonts = useLocalFonts();

    if (!fonts.fontsLoaded)
        return null;
    
    return (
        <Modal
            visible={props.showCalendar} 
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
                        borderRadius: 12
                    }}
                >
                    <View
                        style={{
                            paddingVertical: padding.lg,
                            paddingHorizontal: padding.lg,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
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
                            onPress={() => props.setShowCalendar(false)}
                        />
                    </View>
                    <Calendar
                        style={{
                            borderRadius: 8
                        }}
                        theme={{
                            calendarBackground: colors.schemes.light.surface,
                            textDayFontFamily: 'Arimo-Regular',
                            textMonthFontFamily: 'Arimo-Medium',
                            textDayHeaderFontFamily: 'Arimo-Medium',
                            todayTextColor: colors.coreColors.primary,
                        }}
                        renderArrow={(direction) => (
                            <>
                                {direction === "left" &&
                                    <ArrowLeft
                                        size={18}
                                        strokeWidth={2}
                                    />
                                }
                                {direction !== "left" &&
                                    <ArrowRight
                                        size={18}
                                        strokeWidth={2}
                                    />
                                }
                            </>
                        )}
                        onDayPress={day => {
                            const pressedDateString = `${day.dateString}T00:00:00`;
                            const pressedDate = new Date(pressedDateString);
                            
                            // Finding the Date Offset
                            // When we add this to the date,
                            // we get the pressed date. The
                            // reason why I'm doing this is
                            // because of the Week component.
                            const dateOffset = pressedDate.getDay();
                            props.setDateOffset(dateOffset);

                            // Finding the Base Date
                            const baseDate = new Date(pressedDateString);
                            baseDate.setDate(baseDate.getDate() - baseDate.getDay());
                            props.setDateStart(baseDate);
                        }}
                        markedDates={{
                            [props.date.toISOString().split('T')[0]]: {
                                selected: true, 
                                disableTouchEvent: true, 
                                selectedColor: colors.coreColors.primary
                            }
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}