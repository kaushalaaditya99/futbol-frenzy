import BottomScreen from "@/components/ui/BottomScreen";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineButton from "@/components/ui/button/InlineButton";
import Calendar from "@/components/ui/calendar/Calendar";
import InputCheckbox from "@/components/ui/input/InputCheckbox";
import InputDropdown from "@/components/ui/input/InputDropdown";
import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import ThemedText from "@/components/ui/ThemedText";
import { Class } from "@/services/classes"
import { theme } from "@/theme";
import { CalendarIcon, CheckIcon, ClockIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { DateData } from "react-native-calendars";

// UI could be less confusing, but I cannot be arsed right now.

interface AssignWorkoutProps {
    classes: Array<Class>;
    onClose: () => void;
}

const hours = [...Array(12)].map((hour, i) => [i + 1, String(i + 1).padStart(2, '0')]);
const minutes = [...Array(61)].map((hour, i) => [i, String(i).padStart(2, '0')]);

export default function AssignWorkout(props: AssignWorkoutProps) {
    const [classes, setClasses] = useState<{[k: string]: Set<number>}>({});
    const [date, setDate] = useState("");
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);
    const [day, setDay] = useState("PM");
    const [marked, setMarked] = useState<any>({});

    useEffect(() => {
        const today = new Date();
        console.log("today", today);
        setDate(today.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        const dates: string[] = [];
        for (const dString of Object.keys(classes)) {
            dates.push(dString.slice(0, 10));
        }
        console.log(dates);

        const marked: any = {};
        for (const aDate of dates) {
            if (!(aDate in marked)) {
                marked[aDate] = {
                    dots: []
                };
            }
            marked[aDate].dots.push({color: theme.colors.coreColors.primary, selectedDotColor: 'white'});
        }

        const currDate = date.slice(0, 10);
        if (!(currDate in marked)) {
            marked[currDate] = {};
        }
        marked[currDate] = {
            selected: true,
            selectedColor: theme.colors.coreColors.primary
        };

        console.log(marked);
        setMarked(marked);
    }, [date, classes]);

    const toggleID = (classes: {[k: string]: Set<number>}, id: number, date: string, hour: number, minute: number, day: string) => {
        console.log("input date", date);
        const d = new Date(`${date}T01:00`);
        console.log("hour", hour, minute, day);
        d.setUTCHours(hour + ((day === "PM" && hour > 12) ? 12 : 0), minute, 0, 0);
        const dString = d.toISOString().slice(0, -8);
        console.log("toggleID dString", dString);
        const ids = classes[dString] || new Set();

        if (!ids.has(id)) 
            ids.add(id);
        else 
            ids.delete(id);
        
        setClasses({
            ...classes,
            [dString]: ids
        });
    }

    const getIDs = (classes: any, date: string, hour: number, minute: number, day: string) => {
        const d = new Date(`${date}T00:00`);
        d.setUTCHours(hour + ((day === "PM" && hour > 12) ? 12 : 0), minute, 0, 0);
        const dString = d.toISOString().slice(0, -8);
        const ids = classes[dString] || new Set();
        return ids;
    }

    return (
        <BottomScreen
            title="Assign Workout"
            scroll={true}
            onClose={props.onClose}
        >
            <View
                style={{
                    flex: 1,
                    rowGap: theme.padding.xl,
                }}
            >
                <View
                    style={{
                        padding: theme.padding.lg,
                        rowGap: theme.padding.lg,
                        borderWidth: 1,
                        borderRadius: theme.borderRadius.base,
                        borderColor: theme.colors.schemes.light.outlineVariant
                    }}
                >
                    <Calendar
                        onDayPress={(dateData: DateData) => setDate(dateData.dateString)}
                        markedDates={marked as any}
                        markingType={'multi-dot'}
                        style={{
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            backgroundColor: "white",
                        }}
                        theme={{
                            calendarBackground: "white",
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: theme.padding.md
                        }}
                    >
                        <ClockIcon
                            size={20}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: theme.padding.sm
                            }}
                        >
                            <InputDropdownV2
                                value={hour}
                                options={hours as [number, string][]}
                                onChange={setHour}
                                svgStyle={{
                                    display: "none"
                                }}
                            />
                            <ThemedText>
                                :
                            </ThemedText>
                            <InputDropdownV2
                                value={minute}
                                options={minutes as [number, string][]}
                                onChange={setMinute}
                                svgStyle={{
                                    display: "none"
                                }}
                            />
                            <InputDropdownV2
                                value={day}
                                options={[["AM", "AM"], ["PM", "PM"]]}
                                onChange={setDay}
                                svgStyle={{
                                    display: "none"
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            paddingTop: theme.padding.lg,
                            borderTopWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: theme.padding.md
                            }}
                        >
                            {props.classes.map((class_, i) => (
                                <Pressable
                                    key={i}
                                    onPress={() => toggleID(classes, class_.id, date, hour, minute, day)}
                                    style={{
                                        paddingVertical: theme.padding.md,
                                        paddingHorizontal: theme.padding.xl,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: theme.padding.md,
                                        borderRadius: 1000,
                                        borderWidth: 1,
                                        borderColor: getIDs(classes, date, hour, minute, day).has(class_.id) ? theme.colors.coreColors.primary : theme.colors.schemes.light.outlineVariant,
                                        backgroundColor: getIDs(classes, date, hour, minute, day).has(class_.id) ? theme.colors.coreColors.primary : "white",
                                        ...theme.shadow.sm
                                    }}
                                >
                                    {getIDs(classes, date, hour, minute, day).has(class_.id) &&
                                        <CheckIcon
                                            size={16}
                                            color="white"
                                        />
                                    }
                                    <ThemedText
                                        style={{
                                            fontWeight: getIDs(classes, date, hour, minute, day).has(class_.id) ? 500 : 400,
                                            letterSpacing: theme.letterSpacing.xl,
                                            color: getIDs(classes, date, hour, minute, day).has(class_.id) ? "white" : theme.colors.schemes.light.onSurfaceVariant
                                        }}
                                    >
                                        {class_.className}
                                    </ThemedText>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
                <Button
                    {...buttonTheme.blue}
                    onPress={props.onClose}
                    outerStyle={{
                        height: 48,
                        minHeight: 48,
                        maxHeight: 48
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: "white"
                        }}
                    >
                        Assign
                    </ThemedText>
                </Button>
            </View>
        </BottomScreen>
    )
}