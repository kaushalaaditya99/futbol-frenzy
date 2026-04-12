import { useEffect, useRef, useState } from "react";
import {
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { DateData } from "react-native-calendars";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow, theme } from "@/theme";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import InputText from "@/components/ui/input/InputText";
import Button from "@/components/ui/button/Button";
import ThemedText from "@/components/ui/ThemedText";
import Calendar from "@/components/ui/calendar/Calendar";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import { ArrowRight, CalendarDays, Clock, GripVertical, Plus, X } from "lucide-react-native";
import { Drillv2, getDrills } from "@/services/drills";
import DrillPickerSheet from "@/components/pages/createSession/DrillPickerSheet";
import TimePicker from "@/components/pages/createSession/TimePicker";

// ─── Draggable Drill Row ─────────────────────────────────────────────────────

const ITEM_HEIGHT = 76;

interface DraggableDrillRowProps {
    drill: Drillv2;
    index: number;
    isDragging: boolean;
    dragY: number;
    onRemove: () => void;
    onDragStart: (index: number) => void;
    onDragMove: (dy: number) => void;
    onDragEnd: (index: number, dy: number) => void;
}

function DraggableDrillRow(props: DraggableDrillRowProps) {
    const indexRef = useRef(props.index);
    useEffect(() => { indexRef.current = props.index; });

    const callbacksRef = useRef({
        onDragStart: props.onDragStart,
        onDragMove: props.onDragMove,
        onDragEnd: props.onDragEnd,
    });
    useEffect(() => {
        callbacksRef.current = {
            onDragStart: props.onDragStart,
            onDragMove: props.onDragMove,
            onDragEnd: props.onDragEnd,
        };
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                callbacksRef.current.onDragStart(indexRef.current);
            },
            onPanResponderMove: (_, gs) => {
                callbacksRef.current.onDragMove(gs.dy);
            },
            onPanResponderRelease: (_, gs) => {
                callbacksRef.current.onDragEnd(indexRef.current, gs.dy);
            },
            onPanResponderTerminate: () => {
                callbacksRef.current.onDragEnd(indexRef.current, 0);
            },
        })
    ).current;

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: props.isDragging
                    ? colors.coreColors.primary
                    : colors.schemes.light.outlineVariant,
                borderRadius: borderRadius.base,
                paddingVertical: 14,
                paddingHorizontal: 12,
                columnGap: 10,
                transform: [{ translateY: props.isDragging ? props.dragY : 0 }],
                zIndex: props.isDragging ? 100 : 1,
                elevation: props.isDragging ? 8 : 0,
                ...(props.isDragging ? shadow.lg : shadow.sm),
            }}
        >
            <View {...panResponder.panHandlers} style={{ padding: 4 }}>
                <GripVertical size={16} color={colors.schemes.light.onSurfaceVariant} />
            </View>
            <View
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.coreColors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ThemedText style={{ fontSize: fontSize.sm, fontWeight: 700, color: "white" }}>
                    {props.index + 1}
                </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 600,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {props.drill.drillName}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: fontSize.sm,
                        color: colors.schemes.light.onSurfaceVariant,
                        marginTop: 2,
                    }}
                >
                    {props.drill.type} · {props.drill.time} min
                </ThemedText>
            </View>
            <Pressable
                onPress={props.onRemove}
                hitSlop={8}
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.schemes.light.errorContainer,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <X size={14} color={colors.schemes.light.error} strokeWidth={2.5} />
            </Pressable>
        </View>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toCalendarKey(d: Date) {
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
    ].join("-");
}

function toFriendlyDate(d: Date) {
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CreateSession() {
    const { date: dateParam } = useLocalSearchParams<{ date?: string }>();

    // Initialise from the calendar's selected date (or today), always 23:59
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = dateParam ? new Date(dateParam) : new Date();
        d.setHours(23, 59, 0, 0);
        return d;
    });
    const [dateText, setDateText] = useState(() => toFriendlyDate(
        (() => { const d = dateParam ? new Date(dateParam) : new Date(); return d; })()
    ));
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const displayTime = selectedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const [name, setName] = useState("");
    const [selectedDrills, setSelectedDrills] = useState<Drillv2[]>([]);
    const [showDrillPicker, setShowDrillPicker] = useState(false);
    const [allDrills, setAllDrills] = useState<Drillv2[]>([]);
    const [nameError, setNameError] = useState("");

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragY, setDragY] = useState(0);

    useEffect(() => {
        getDrills(0).then(setAllDrills);
    }, []);

    const totalDuration = selectedDrills.reduce((sum, d) => sum + d.time, 0);
    const canCreate = name.trim().length > 0 && selectedDrills.length > 0;

    // Calendar day selected inside the picker modal
    const handleCalendarDayPress = (day: DateData) => {
        const d = new Date(day.year, day.month - 1, day.day);
        setSelectedDate(d);
        setDateText(toFriendlyDate(d));
        setShowCalendarPicker(false);
    };

    const handleConfirmDrills = (selectedIds: Set<number>) => {
        const kept = selectedDrills.filter((d) => selectedIds.has(d.id));
        const keptIds = new Set(kept.map((d) => d.id));
        const added = allDrills.filter((d) => selectedIds.has(d.id) && !keptIds.has(d.id));
        setSelectedDrills([...kept, ...added]);
        setShowDrillPicker(false);
    };

    const removeDrill = (id: number) => {
        setSelectedDrills((prev) => prev.filter((d) => d.id !== id));
    };

    const handleDragStart = (index: number) => { setDraggingIndex(index); setDragY(0); };
    const handleDragMove  = (dy: number)    => { setDragY(dy); };
    const handleDragEnd   = (index: number, dy: number) => {
        if (dy !== 0) {
            const delta = Math.round(dy / ITEM_HEIGHT);
            const to = Math.max(0, Math.min(selectedDrills.length - 1, index + delta));
            if (to !== index) {
                setSelectedDrills((prev) => {
                    const next = [...prev];
                    const [removed] = next.splice(index, 1);
                    next.splice(to, 0, removed);
                    return next;
                });
            }
        }
        setDraggingIndex(null);
        setDragY(0);
    };

    const onCreateSession = () => {
        if (!name.trim()) { setNameError("Must enter a session name."); return; }
        router.back();
    };

    return (
        <SafeAreaView
            edges={["top"]}
            style={{ flex: 1, backgroundColor: theme.colors.schemes.light.surface }}
        >
            <HeaderWithBack
                header="Create Session"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                }}
                buttonStyle={{ backgroundColor: "#00000010" }}
            />
            <ScrollView
                style={{ backgroundColor: theme.colors.schemes.light.background }}
                contentContainerStyle={{ paddingBottom: 40 }}
                scrollEnabled={draggingIndex === null}
            >
                {/* ── General Information ── */}
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: theme.fontSize.lg,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.sm,
                            color: theme.colors.schemes.light.onSurface,
                        }}
                    >
                        General Information
                    </ThemedText>

                    <InputText
                        label="Session Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (nameError) setNameError("");
                        }}
                        errorMessage={nameError}
                    />

                    {/* Schedule Date */}
                    <View style={{ rowGap: theme.padding.md }}>
                        <ThemedText
                            style={{
                                fontSize: theme.fontSize.sm,
                                fontWeight: 500,
                                color: theme.colors.schemes.light.onSurface,
                                letterSpacing: theme.letterSpacing.xl,
                            }}
                        >
                            Schedule Date
                        </ThemedText>
                        <View style={{ flexDirection: "row", columnGap: theme.padding.lg }}>

                            {/* Date — text input + calendar icon button */}
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: "white",
                                    ...shadow.sm,
                                    overflow: "hidden",
                                }}
                            >
                                <TextInput
                                    value={dateText}
                                    onChangeText={setDateText}
                                    placeholder="MM/DD/YYYY"
                                    placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                                    style={{
                                        flex: 1,
                                        paddingVertical: padding.md,
                                        paddingHorizontal: padding.lg,
                                        fontSize: fontSize.md,
                                        fontFamily: "Arimo-Regular",
                                        color: colors.schemes.light.onBackground,
                                    }}
                                />
                                {/* Calendar icon opens the mini picker */}
                                <Pressable
                                    onPress={() => setShowCalendarPicker(true)}
                                    style={{
                                        paddingVertical: padding.md,
                                        paddingHorizontal: padding.md,
                                        borderLeftWidth: 1,
                                        borderColor: colors.schemes.light.outlineVariant,
                                        backgroundColor: colors.schemes.light.surfaceContainerLow,
                                    }}
                                >
                                    <CalendarDays
                                        size={18}
                                        color={colors.schemes.light.onSurfaceVariant}
                                    />
                                </Pressable>
                            </View>

                            {/* Time — pressable opens native wheel picker */}
                            <Pressable
                                onPress={() => setShowTimePicker(true)}
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: borderRadius.sm,
                                    backgroundColor: "white",
                                    paddingVertical: padding.md,
                                    paddingHorizontal: padding.lg,
                                    columnGap: padding.sm,
                                    ...shadow.sm,
                                }}
                            >
                                <Clock
                                    size={16}
                                    color={colors.schemes.light.onSurfaceVariant}
                                />
                                <ThemedText
                                    style={{
                                        fontSize: fontSize.md,
                                        color: colors.schemes.light.onBackground,
                                    }}
                                >
                                    {displayTime}
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* ── Drills ── */}
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: theme.fontSize.lg,
                                    fontWeight: 500,
                                    letterSpacing: theme.letterSpacing.sm,
                                    color: theme.colors.schemes.light.onSurface,
                                }}
                            >
                                Drills
                            </ThemedText>
                            {selectedDrills.length > 0 && (
                                <ThemedText
                                    style={{
                                        fontSize: theme.fontSize.sm,
                                        color: theme.colors.schemes.light.onSurfaceVariant,
                                    }}
                                >
                                    {selectedDrills.length} drills · {totalDuration} min
                                </ThemedText>
                            )}
                        </View>
                        {selectedDrills.length > 0 && (
                            <ThemedText
                                style={{
                                    fontSize: theme.fontSize.sm,
                                    color: theme.colors.schemes.light.onSurfaceVariant,
                                    marginTop: 3,
                                    letterSpacing: letterSpacing.lg,
                                }}
                            >
                                Drag to reorder · Students complete in this order
                            </ThemedText>
                        )}
                    </View>

                    {selectedDrills.length === 0 && (
                        <Pressable
                            onPress={() => setShowDrillPicker(true)}
                            style={{
                                borderWidth: 1.5,
                                borderStyle: "dashed",
                                borderColor: colors.schemes.light.outlineVariant,
                                borderRadius: borderRadius.base,
                                paddingVertical: 28,
                                alignItems: "center",
                                justifyContent: "center",
                                rowGap: 8,
                            }}
                        >
                            <Plus size={20} color={colors.schemes.light.onSurfaceVariant} />
                            <ThemedText
                                style={{
                                    fontSize: fontSize.md,
                                    fontWeight: 500,
                                    color: colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                Add Drills
                            </ThemedText>
                        </Pressable>
                    )}

                    {selectedDrills.length > 0 && (
                        <View style={{ rowGap: 8 }}>
                            {selectedDrills.map((drill, i) => (
                                <DraggableDrillRow
                                    key={drill.id}
                                    drill={drill}
                                    index={i}
                                    isDragging={draggingIndex === i}
                                    dragY={draggingIndex === i ? dragY : 0}
                                    onRemove={() => removeDrill(drill.id)}
                                    onDragStart={handleDragStart}
                                    onDragMove={handleDragMove}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                            <Pressable
                                onPress={() => setShowDrillPicker(true)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    columnGap: 6,
                                    borderWidth: 1,
                                    borderStyle: "dashed",
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: borderRadius.base,
                                    paddingVertical: 14,
                                }}
                            >
                                <Plus size={16} color={colors.coreColors.primary} />
                                <ThemedText
                                    style={{
                                        fontSize: fontSize.md,
                                        fontWeight: 500,
                                        color: colors.coreColors.primary,
                                    }}
                                >
                                    Add More Drills
                                </ThemedText>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* ── Create Button ── */}
                <View
                    style={{
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                    }}
                >
                    <Button
                        onPress={canCreate ? onCreateSession : undefined}
                        {...(canCreate ? buttonTheme.blue : buttonTheme.disabled)}
                        // Added a height, the buttons are finicky, my bad
                        innerStyle={{ width: "100%", height: 48 }}
                    >
                        <ThemedText
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                letterSpacing: -0.25,
                                color: "white",
                            }}
                        >
                            Create Session
                        </ThemedText>
                        <ArrowRight size={18} color="white" strokeWidth={2.5} />
                    </Button>
                </View>
            </ScrollView>

            {/* ── Calendar Picker Modal ── */}
            <Modal
                visible={showCalendarPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCalendarPicker(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowCalendarPicker(false)}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.45)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    />
                </TouchableWithoutFeedback>
                <View
                    style={{
                        position: "absolute",
                        left: 20,
                        right: 20,
                        top: "25%",
                        backgroundColor: colors.schemes.light.background,
                        borderRadius: borderRadius.lg,
                        overflow: "hidden",
                        ...shadow.lg,
                    }}
                >
                    {/* Modal header */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                            paddingTop: 16,
                            paddingBottom: 8,
                            borderBottomWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.lg,
                                fontWeight: 600,
                                letterSpacing: letterSpacing.xs,
                                color: colors.schemes.light.onSurface,
                            }}
                        >
                            Select Date
                        </ThemedText>
                        <Pressable onPress={() => setShowCalendarPicker(false)} hitSlop={8}>
                            <X size={20} color={colors.schemes.light.onSurfaceVariant} />
                        </Pressable>
                    </View>

                    {/* Calendar */}
                    <Calendar
                        onDayPress={handleCalendarDayPress}
                        markedDates={{
                            [toCalendarKey(selectedDate)]: {
                                selected: true,
                                selectedColor: colors.coreColors.primary,
                            },
                        }}
                    />
                </View>
            </Modal>

            {/* ── Drill Picker Sheet ── */}
            <DrillPickerSheet
                visible={showDrillPicker}
                drills={allDrills}
                selectedDrillIds={new Set(selectedDrills.map((d) => d.id))}
                onConfirm={handleConfirmDrills}
                onClose={() => setShowDrillPicker(false)}
            />
            {/* ── Time Picker ── */}
            <TimePicker
                visible={showTimePicker}
                value={selectedDate}
                onConfirm={(date) => {
                    setSelectedDate((prev) => {
                        const next = new Date(prev);
                        next.setHours(date.getHours(), date.getMinutes(), 0, 0);
                        return next;
                    });
                    setShowTimePicker(false);
                }}
                onClose={() => setShowTimePicker(false)}
            />
        </SafeAreaView>
    );
}
