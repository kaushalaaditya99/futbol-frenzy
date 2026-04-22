import { toESTDateString } from "@/utils/dateUtils";
import BottomScreen from "@/components/ui/BottomScreen";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import IconButton from "@/components/ui/button/IconButton";
import InlineButton from "@/components/ui/button/InlineButton";
import Calendar from "@/components/ui/calendar/Calendar";
import InputCheckbox from "@/components/ui/input/InputCheckbox";
import InputDropdown from "@/components/ui/input/InputDropdown";
import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import InputDropdownV3 from "@/components/ui/input/InputDropdownV3";
import ThemedText from "@/components/ui/ThemedText";
import { Class } from "@/services/classes"
import { shadow, theme } from "@/theme";
import { CalendarIcon, CheckIcon, ClockIcon, PlusIcon, Trash2Icon, UsersRoundIcon } from "lucide-react-native";
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
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

    useEffect(() => {
        const today = new Date();
        console.log("today", today);
        setDate(toESTDateString(today));
    }, []);

    useEffect(() => {
        const dates: string[] = [];
        for (const dString of Object.keys(classes)) {
            dates.push(dString.slice(0, 10));
        }
        // console.log(dates);

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

        // console.log(marked);
        setMarked(marked);
    }, [date, classes]);

    const buildDateTimeString = (date: string, hour: number, minute: number, day: string) => {
        const h = hour + ((day === "PM" && hour < 12) ? 12 : 0) - ((day === "AM" && hour === 12) ? 12 : 0);
        return `${date}T${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    const toggleID = (classes: {[k: string]: Set<number>}, id: number, date: string, hour: number, minute: number, day: string) => {
        const dString = buildDateTimeString(date, hour, minute, day);
        // console.log("toggleID dString", dString);
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

    useEffect(() => {
        console.log('ok', classes)
    }, [classes])

    const addID = (classes: {[k: string]: Set<number>}, id: number, date: string, hour: number, minute: number, day: string) => {
        setClasses(prevClasses => {
            const dString = buildDateTimeString(date, hour, minute, day);
            const ids = new Set(prevClasses[dString] || []);  // new Set!

            if (!ids.has(id)) ids.add(id);

            return { ...prevClasses, [dString]: ids };
        });
    }

    const delID = (classes: {[k: string]: Set<number>}, id: number, date: string, hour: number, minute: number, day: string) => {
        setClasses(prevClasses => {
            const dString = buildDateTimeString(date, hour, minute, day);
            const ids = new Set(prevClasses[dString] || []);  // new Set!

            ids.delete(id);

            return { ...prevClasses, [dString]: ids };
        });
    }

    const getIDs = (classes: any, date: string, hour: number, minute: number, day: string) => {
        if (!date)
            return new Set();

        const dString = buildDateTimeString(date, hour, minute, day);
        const ids = classes[dString] || new Set();
        return ids;
    }

    const parseDateTime = (dString: string) => {
        const [datePart, timePart] = dString.split('T');
        const [rawHour, minute] = timePart.split(':').map(Number);
        const day = rawHour >= 12 ? "PM" : "AM";
        const hour = rawHour > 12 ? rawHour - 12 : rawHour === 0 ? 12 : rawHour;

        return { date: datePart, hour, minute, day };
    }

    const formatDate = (datePart: string) => {
        const [year, month, day] = datePart.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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
                            // flexDirection: "row",
                            // flex: 1,
                            // alignItems: "center",
                            rowGap: theme.padding.md
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: theme.padding.md,
                                minHeight: 32,
                                maxHeight: 32,
                                height: 32,
                                // backgroundColor: "yellow"
                            }}
                        >
                            {/* <ClockIcon
                                size={20}
                                style={{
                                    // backgroundColor: "red"
                                }}
                            /> */}
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
                                    containerStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32,
                                        // backgroundColor: "orange"
                                    }}
                                    buttonStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32,
                                        // backgroundColor: "orange"
                                    }}
                                    svgStyle={{
                                        display: "none"
                                    }}
                                />
                                <ThemedText
                                    // style={{
                                    //     minHeight: 24,
                                    //     maxHeight: 24,
                                    //     height: 24
                                    // }}
                                >
                                    :
                                </ThemedText>
                                <InputDropdownV2
                                    value={minute}
                                    options={minutes as [number, string][]}
                                    onChange={setMinute}
                                    containerStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32
                                    }}
                                    buttonStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32,
                                        // backgroundColor: "orange"
                                    }}
                                    svgStyle={{
                                        display: "none"
                                    }}
                                />
                                <InputDropdownV2
                                    value={day}
                                    options={[["AM", "AM"], ["PM", "PM"]]}
                                    onChange={setDay}
                                    containerStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32
                                    }}
                                    buttonStyle={{
                                        minHeight: 32,
                                        maxHeight: 32,
                                        height: 32,
                                        // backgroundColor: "orange"
                                    }}
                                    svgStyle={{
                                        display: "none"
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                // flexShrink: 1,
                                flex: 1,
                                alignItems: "center",
                                columnGap: theme.padding.md,
                                // backgroundColor: "red"
                            }}
                        >
                            {/* <UsersRoundIcon
                                size={20}
                            /> */}
                            <InputDropdownV3
                                values={selectedClasses}
                                options={props.classes.map((c, i) => [c.id, c.className])}
                                labelPrefix=""
                                setValues={setSelectedClasses}
                                defaultLabel="Select Classes"
                                containerStyle={{
                                    minHeight: 32,
                                    maxHeight: 32,
                                    height: 32,
                                    paddingVertical: 0,
                                    // width: 144,
                                    // flexDirection: "row",
                                    // alignItems: "center",
                                    // justifyContent: "center"
                                }}
                            />
                        </View>
                        <Button
                            {...buttonTheme.white}
                            outerStyle={{
                                height: 32,
                                minHeight: 32,
                                maxHeight: 32
                            }}
                            onPress={() => {
                                for (const classID of selectedClasses)
                                    addID(classes, classID, date, hour, minute, day)
                                console.log('here')
                            }}
                        >
                            <PlusIcon
                                size={20}
                            />
                        </Button>
                    </View>
                    <View
                        style={{
                            paddingTop: theme.padding.lg,
                            borderTopWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                        }}
                    >
                        {Object.entries(classes).map(([date, dateClasses], i) => {
                            const dateData = parseDateTime(date);

                            if (!dateClasses.size) {
                                return (
                                    <></>
                                )
                            }

                            return (
                                <View key={i}>
                                    <View>
                                        <ThemedText
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 500,
                                                letterSpacing: theme.letterSpacing.xl * 1,
                                                marginBottom: 12
                                            }}
                                        >
                                            {`${formatDate(parseDateTime(date)['date'])} at ${parseDateTime(date)['hour'].toString().padStart(2, '0')}:${parseDateTime(date)['minute'].toString().padStart(2, '0')} ${parseDateTime(date)['day']}`}
                                        </ThemedText>
                                    </View>
                                    {props.classes.filter(c => dateClasses.has(c.id)).map((c, i) => (
                                        <View 
                                            key={i}
                                            style={{
                                                // height: 32,
                                                paddingHorizontal: theme.padding.sm,
                                                paddingLeft: theme.padding.lg,
                                                paddingVertical: theme.padding.sm,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                columnGap: theme.padding.lg,
                                                borderRadius: theme.borderRadius.base,
                                                borderWidth: 1,
                                                borderColor: theme.colors.schemes.light.outlineVariant,
                                                ...shadow.md,
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 14,
                                                    letterSpacing: theme.letterSpacing.xl * 2
                                                }}
                                            >
                                                {c.className}
                                            </ThemedText>
                                            <IconButton
                                                {...buttonTheme.white}
                                                outerStyle={{
                                                    height: 32,
                                                    maxHeight: 32,
                                                    minHeight: 32
                                                }}
                                                tintColor='#ffd1d1'
                                                borderColor='#ffd1d1'
                                                innerMostStyle={{
                                                    backgroundColor: '#ffd1d1'
                                                }}
                                                onPress={() => delID(classes, c.id, dateData['date'], dateData['hour'], dateData['minute'], dateData['day'])}
                                            >
                                                <Trash2Icon
                                                    size={18}
                                                    color='#e43131'
                                                />
                                            </IconButton>
                                        </View>
                                    ))}
                                    <ThemedText>
                                    </ThemedText>
                                </View>
                            )
                        })}
                        {/* <ThemedText>
                            {JSON.stringify(selectedClasses)} 
                            {JSON.stringify(classes)} 
                        </ThemedText> */}
                        {/* <View
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
                        </View> */}
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