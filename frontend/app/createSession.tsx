import { useEffect, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow, theme } from "@/theme";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import InputText from "@/components/ui/input/InputText";
import Button from "@/components/ui/button/Button";
import ThemedText from "@/components/ui/ThemedText";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import { CalendarDays, Clock, Plus, X } from "lucide-react-native";
import { Drillv2, getDrills } from "@/services/drills";
import DrillPickerSheet from "@/components/pages/createSession/DrillPickerSheet";

export default function CreateSession() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedDrills, setSelectedDrills] = useState<Drillv2[]>([]);
    const [showDrillPicker, setShowDrillPicker] = useState(false);
    const [allDrills, setAllDrills] = useState<Drillv2[]>([]);
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        getDrills(0).then(setAllDrills);
    }, []);

    const totalDuration = selectedDrills.reduce((sum, d) => sum + d.time, 0);
    const canCreate = name.trim().length > 0 && selectedDrills.length > 0;

    const handleConfirmDrills = (selectedIds: Set<number>) => {
        const drills = allDrills.filter((d) => selectedIds.has(d.id));
        setSelectedDrills(drills);
        setShowDrillPicker(false);
    };

    const removeDrill = (id: number) => {
        setSelectedDrills((prev) => prev.filter((d) => d.id !== id));
    };

    const onCreateSession = () => {
        if (!name.trim()) {
            setNameError("Must enter a session name.");
            return;
        }
        // Submit session here
        router.back();
    };

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: theme.colors.schemes.light.surface,
            }}
        >
            <HeaderWithBack
                header="Create Session"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: theme.margin.xs,
                    paddingHorizontal: theme.margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010",
                }}
            />
            <ScrollView
                style={{ backgroundColor: theme.colors.schemes.light.background }}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* General Information */}
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        backgroundColor: theme.colors.schemes.light.background,
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

                    {/* Schedule */}
                    <View style={{ rowGap: theme.padding.md }}>
                        <ThemedText
                            style={{
                                fontSize: theme.fontSize.sm,
                                fontWeight: 500,
                                color: theme.colors.schemes.light.onSurface,
                                letterSpacing: theme.letterSpacing.xl,
                            }}
                        >
                            Schedule
                        </ThemedText>
                        <View style={{ flexDirection: "row", columnGap: theme.padding.lg }}>
                            {/* Date */}
                            <View
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
                                <CalendarDays
                                    size={16}
                                    color={colors.schemes.light.onSurfaceVariant}
                                />
                                <TextInput
                                    value={date}
                                    onChangeText={setDate}
                                    placeholder="MM/DD/YYYY"
                                    placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                                    style={{
                                        flex: 1,
                                        fontSize: fontSize.md,
                                        fontFamily: "Arimo-Regular",
                                        color: colors.schemes.light.onBackground,
                                    }}
                                />
                            </View>
                            {/* Time */}
                            <View
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
                                <TextInput
                                    value={time}
                                    onChangeText={setTime}
                                    placeholder="HH:MM AM"
                                    placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                                    style={{
                                        flex: 1,
                                        fontSize: fontSize.md,
                                        fontFamily: "Arimo-Regular",
                                        color: colors.schemes.light.onBackground,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Drills */}
                <View
                    style={{
                        paddingTop: theme.margin.sm - 8,
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.lg,
                        backgroundColor: theme.colors.schemes.light.background,
                        borderBottomWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                    }}
                >
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
                                {totalDuration} min total
                            </ThemedText>
                        )}
                    </View>

                    {/* Empty state */}
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

                    {/* Drill list */}
                    {selectedDrills.length > 0 && (
                        <View style={{ rowGap: 8 }}>
                            {selectedDrills.map((drill, i) => (
                                <View
                                    key={drill.id}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: "white",
                                        borderWidth: 1,
                                        borderColor: colors.schemes.light.outlineVariant,
                                        borderRadius: borderRadius.base,
                                        paddingVertical: 12,
                                        paddingHorizontal: 12,
                                        columnGap: 10,
                                        ...shadow.sm,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            width: 20,
                                            fontSize: fontSize.sm,
                                            fontWeight: 600,
                                            color: colors.schemes.light.onSurfaceVariant,
                                            textAlign: "center",
                                        }}
                                    >
                                        {i + 1}
                                    </ThemedText>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText
                                            style={{
                                                fontSize: fontSize.md,
                                                fontWeight: 500,
                                                color: colors.schemes.light.onSurface,
                                            }}
                                        >
                                            {drill.name}
                                        </ThemedText>
                                        <ThemedText
                                            style={{
                                                fontSize: fontSize.sm,
                                                color: colors.schemes.light.onSurfaceVariant,
                                                marginTop: 2,
                                            }}
                                        >
                                            {drill.time} min · {drill.type}
                                        </ThemedText>
                                    </View>
                                    <Pressable onPress={() => removeDrill(drill.id)} hitSlop={8}>
                                        <X
                                            size={18}
                                            color={colors.schemes.light.onSurfaceVariant}
                                        />
                                    </Pressable>
                                </View>
                            ))}

                            {/* Add More Drills */}
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
                                <Plus size={16} color={colors.schemes.light.onSurfaceVariant} />
                                <ThemedText
                                    style={{
                                        fontSize: fontSize.md,
                                        fontWeight: 500,
                                        color: colors.schemes.light.onSurfaceVariant,
                                    }}
                                >
                                    Add More Drills
                                </ThemedText>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Create Button */}
                <View
                    style={{
                        paddingVertical: theme.margin.sm,
                        paddingHorizontal: theme.margin.sm,
                        rowGap: theme.padding.md,
                    }}
                >
                    <Button
                        onPress={canCreate ? onCreateSession : undefined}
                        {...(canCreate ? buttonTheme.blue : buttonTheme.disabled)}
                        innerStyle={{ width: "100%" }}
                    >
                        <Plus size={18} strokeWidth={2.5} color="white" />
                        <ThemedText
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                letterSpacing: -0.25,
                                color: "white",
                            }}
                        >
                            {canCreate && totalDuration > 0
                                ? `Create Session · ${totalDuration} min`
                                : "Create Session"}
                        </ThemedText>
                    </Button>
                </View>
            </ScrollView>

            <DrillPickerSheet
                visible={showDrillPicker}
                drills={allDrills}
                selectedDrillIds={new Set(selectedDrills.map((d) => d.id))}
                onConfirm={handleConfirmDrills}
                onClose={() => setShowDrillPicker(false)}
            />
        </SafeAreaView>
    );
}
