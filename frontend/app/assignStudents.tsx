import ThemedText from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";
import { getSession, Session } from "@/services/sessions";
import { getClasses, Class } from "@/services/classes";
import { createAssignment } from "@/services/assignments";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronLeft, Calendar } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ClassRowProps {
    classItem: Class;
    checked: boolean;
    editMode: boolean;
    onToggle: () => void;
}

function ClassRow({ classItem, checked, editMode, onToggle }: ClassRowProps) {
    const checkboxBg = checked
        ? editMode
            ? colors.coreColors.primary
            : colors.schemes.light.surfaceContainerHigh
        : "transparent";

    const checkboxBorder = checked
        ? editMode
            ? colors.coreColors.primary
            : colors.schemes.light.surfaceContainerHigh
        : editMode
        ? colors.schemes.light.outlineVariant
        : colors.schemes.light.surfaceContainerHigh;

    const checkColor = editMode ? "white" : colors.schemes.light.onSurfaceVariant;

    return (
        <Pressable
            onPress={editMode ? onToggle : undefined}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                backgroundColor: checked && !editMode
                    ? colors.schemes.light.surfaceContainerLow
                    : colors.schemes.light.surfaceContainerLowest,
            }}
        >
            {/* Checkbox */}
            <View
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: checkboxBorder,
                    backgroundColor: checkboxBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                    flexShrink: 0,
                }}
            >
                {checked && (
                    <Check size={13} color={checkColor} strokeWidth={3} />
                )}
            </View>

            {/* Avatar initials */}
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: editMode
                        ? colors.schemes.light.primaryContainer
                        : colors.schemes.light.surfaceContainerHigh,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                }}
            >
                <ThemedText
                    style={{
                        fontSize: fontSize.sm,
                        fontWeight: 600,
                        color: editMode
                            ? colors.schemes.light.onPrimaryContainer
                            : colors.schemes.light.onSurfaceVariant,
                    }}
                >
                    {(classItem.imageText || classItem.className || "").toUpperCase().slice(0, 2)}
                </ThemedText>
            </View>

            {/* Name & student count */}
            <View style={{ flex: 1 }}>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 500,
                        color: editMode
                            ? colors.schemes.light.onSurface
                            : colors.schemes.light.onSurfaceVariant,
                    }}
                >
                    {classItem.className}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: fontSize.sm,
                        letterSpacing: letterSpacing.xl,
                        color: editMode
                            ? colors.schemes.light.onSurfaceVariant
                            : colors.schemes.light.outlineVariant,
                    }}
                >
                    {classItem.students?.length || 0} students
                </ThemedText>
            </View>
        </Pressable>
    );
}

export default function AssignStudents() {
    const { token } = useAuth();
    const { sessionId, date, classId } = useLocalSearchParams<{ sessionId: string; date?: string; classId?: string }>();
    const sessionIdNum = sessionId ? Number(sessionId) : 0;
    const preselectedClassId = classId ? Number(classId) : null;

    const [session, setSession] = useState<Session | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Due date state
    const selectedDate = date ? new Date(date) : new Date();
    const [dueDate, setDueDate] = useState(selectedDate.toISOString().split('T')[0]);

    useEffect(() => {
        loadData();
    }, [token, sessionIdNum]);

    useEffect(() => {
        // Pre-select class if classId is provided
        if (preselectedClassId && classes.length > 0) {
            setSelectedClassIds(new Set([preselectedClassId]));
        }
    }, [preselectedClassId, classes]);

    const loadData = async () => {
        if (!token) return;
        setIsLoading(true);

        try {
            const [sessionData, classesData] = await Promise.all([
                getSession(token, sessionIdNum),
                getClasses(token),
            ]);

            if (sessionData) setSession(sessionData);
            setClasses(classesData);
        } catch (err) {
            console.error("Failed to load data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleClass = (id: number) => {
        const next = new Set(selectedClassIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedClassIds(next);
    };

    const selectAll = () => setSelectedClassIds(new Set(classes.map((c) => c.id)));
    const unselectAll = () => setSelectedClassIds(new Set());

    const handleAssign = async () => {
        if (selectedClassIds.size === 0) {
            if (Platform.OS === 'web') {
                window.alert('Please select at least one class.');
            } else {
                Alert.alert('Error', 'Please select at least one class.');
            }
            return;
        }

        if (!token) {
            if (Platform.OS === 'web') {
                window.alert('You must be logged in.');
            } else {
                Alert.alert('Error', 'You must be logged in.');
            }
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createAssignment(token, {
                workoutID: sessionIdNum,
                dueDate: new Date(dueDate).toISOString(),
                classIds: Array.from(selectedClassIds),
            });

            if (result.success) {
                const goBack = () => {
                    // Go back to class page and force refresh
                    if (router.canDismiss()) {
                        router.dismiss(2);
                    } else {
                        router.back();
                    }
                };
                if (Platform.OS === 'web') {
                    window.alert('Assignment created successfully!');
                    goBack();
                } else {
                    Alert.alert('Success', 'Assignment created successfully!', [
                        { text: 'OK', onPress: goBack },
                    ]);
                }
            } else {
                throw new Error(result.error || 'Failed to create assignment');
            }
        } catch (err) {
            console.error("Failed to create assignment:", err);
            if (Platform.OS === 'web') {
                window.alert('Failed to create assignment. Please try again.');
            } else {
                Alert.alert('Error', 'Failed to create assignment. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const allSelected = classes.length > 0 && classes.every((c) => selectedClassIds.has(c.id));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.background,
                }}
            >
                <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 8 }}>
                    <ChevronLeft size={24} color={colors.schemes.light.onSurface} />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Assign to Classes
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.schemes.light.onSurfaceVariant,
                            letterSpacing: letterSpacing.xl,
                        }}
                    >
                        {session?.name ?? "Select classes for this workout"}
                    </ThemedText>
                </View>
            </View>

            {/* Session info card */}
            {session && (
                <View
                    style={{
                        marginHorizontal: margin["3xs"],
                        marginTop: margin["3xs"],
                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        borderRadius: borderRadius.base,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 12,
                        ...shadow.sm,
                    }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: borderRadius.sm,
                            backgroundColor: session.imageBackgroundColor || colors.palettes.neutral[90],
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ThemedText style={{ fontSize: fontSize.sm, fontWeight: "500", color: session.imageTextColor || "black" }}>
                            {session.imageText?.toUpperCase().slice(0, 2) || ""}
                        </ThemedText>
                    </View>
                    <View style={{ flex: 1, rowGap: 2 }}>
                        <ThemedText
                            style={{
                                fontSize: fontSize.md,
                                fontWeight: 600,
                                color: colors.schemes.light.onSurface,
                            }}
                        >
                            {session.name}
                        </ThemedText>
                        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                            <ThemedText
                                style={{
                                    fontSize: fontSize.sm,
                                    color: colors.schemes.light.onSurfaceVariant,
                                    letterSpacing: letterSpacing.xl,
                                }}
                            >
                                {session.type}
                            </ThemedText>
                            <View
                                style={{
                                    width: 3,
                                    height: 3,
                                    borderRadius: 100,
                                    backgroundColor: colors.schemes.light.outlineVariant,
                                }}
                            />
                            <ThemedText
                                style={{
                                    fontSize: fontSize.sm,
                                    color: colors.schemes.light.onSurfaceVariant,
                                    letterSpacing: letterSpacing.xl,
                                }}
                            >
                                {session.drills?.length || 0} drill{(session.drills?.length || 0) !== 1 ? "s" : ""}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            )}

            {/* Due Date Selection */}
            <View
                style={{
                    marginHorizontal: margin["3xs"],
                    marginTop: margin["3xs"],
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    borderWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderRadius: borderRadius.base,
                    padding: 12,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
                    <Calendar size={20} color={colors.schemes.light.onSurfaceVariant} />
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
                            fontWeight: 500,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Due Date
                    </ThemedText>
                </View>
                <TextInput
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="YYYY-MM-DD"
                    style={{
                        marginTop: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        borderRadius: borderRadius.sm,
                        fontSize: fontSize.md,
                        color: colors.schemes.light.onSurface,
                        backgroundColor: colors.schemes.light.background,
                    }}
                />
            </View>

            {/* Select All / Unselect All */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingHorizontal: margin["3xs"],
                    paddingVertical: 8,
                    columnGap: 10,
                }}
            >
                <Pressable
                    onPress={unselectAll}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: borderRadius.base,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.schemes.light.onSurfaceVariant,
                            fontWeight: 500,
                        }}
                    >
                        Unselect All
                    </ThemedText>
                </Pressable>
                <Pressable
                    onPress={selectAll}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: borderRadius.base,
                        borderWidth: 1,
                        borderColor: colors.coreColors.primary,
                        backgroundColor: colors.schemes.light.primaryContainer + "40",
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.coreColors.primary,
                            fontWeight: 500,
                        }}
                    >
                        Select All
                    </ThemedText>
                </Pressable>
            </View>

            {/* Class list */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.coreColors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        marginTop: 0,
                        backgroundColor: colors.schemes.light.surfaceContainerLowest,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        borderRadius: borderRadius.base,
                        marginHorizontal: margin["3xs"],
                        overflow: "hidden",
                        ...shadow.sm,
                    }}
                >
                    {classes.map((classItem) => (
                        <ClassRow
                            key={classItem.id}
                            classItem={classItem}
                            checked={selectedClassIds.has(classItem.id)}
                            editMode={true}
                            onToggle={() => toggleClass(classItem.id)}
                        />
                    ))}
                    {classes.length === 0 && (
                        <View style={{ padding: 20, alignItems: "center" }}>
                            <ThemedText style={{ color: colors.schemes.light.onSurfaceVariant }}>
                                No classes available. Create a class first.
                            </ThemedText>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Assign Button */}
            <View
                style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.background,
                }}
            >
                <Pressable
                    onPress={handleAssign}
                    disabled={isSubmitting || selectedClassIds.size === 0}
                    style={{
                        backgroundColor: selectedClassIds.size === 0
                            ? colors.schemes.light.outlineVariant
                            : colors.coreColors.primary,
                        borderRadius: borderRadius.base,
                        paddingVertical: 14,
                        alignItems: "center",
                        opacity: isSubmitting ? 0.7 : 1,
                    }}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            Assign to {selectedClassIds.size} Class{selectedClassIds.size !== 1 ? "es" : ""}
                        </ThemedText>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}