import { colors, margin, padding } from "@/theme";
import { Modal, Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { Calendar } from "react-native-calendars";

interface ModalCalendarProps {
    date: Date;
    setDateStart: (start: Date) => void;
    setDateOffset: (offset: number) => void;
    showCalendar: boolean;
    setShowCalendar: (b: boolean) => void;
}

export default function ModalCalendar(props: ModalCalendarProps) {
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
                                fontSize: 14,
                                fontWeight: 500,
                                letterSpacing: 0.1,
                                color: colors.schemes.light.onSurface
                            }}
                        >
                            Calendar
                        </ThemedText>
                        <Pressable
                            style={{
                                width: 20,
                                height: 20,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 100,
                                backgroundColor: colors.schemes.light.surfaceContainerLowest
                            }}
                            onPress={() => props.setShowCalendar(false)}
                        >
                            <X
                                size={12}
                                strokeWidth={3}
                                color={colors.schemes.light.onSurface}
                            />
                        </Pressable>
                    </View>
                    <Calendar
                        style={{
                            borderRadius: 8
                        }}
                        theme={{
                            calendarBackground: colors.schemes.light.surface,
                            textDayFontWeight: "400",
                            textMonthFontWeight: "600",
                            textDayHeaderFontWeight: "600",
                            textDayFontFamily: 'Inter_400Regular',
                            textMonthFontFamily: 'Inter_600Bold',
                            textDayHeaderFontFamily: 'Inter_500Medium',
                            todayTextColor: colors.coreColors.primary,
                        }}
                        renderArrow={(direction) => (
                            <>
                                {direction === "left" &&
                                    <ChevronLeft
                                        size={18}
                                        strokeWidth={2}
                                    />
                                }
                                {direction !== "left" &&
                                    <ChevronRight
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