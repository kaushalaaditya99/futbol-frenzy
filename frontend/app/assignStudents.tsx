import ThemedText from "@/components/ui/ThemedText";
import { getSession, Session } from "@/services/sessions";
import { getStudents, Student } from "@/services/students";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Check, ChevronLeft, Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock: students pre-assigned to this session (by student id)
const MOCK_ASSIGNED_IDS = new Set([0, 1, 4]);

interface StudentRowProps {
    student: Student;
    checked: boolean;
    editMode: boolean;
    onToggle: () => void;
}

function StudentRow({ student, checked, editMode, onToggle }: StudentRowProps) {
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
                    {student.first_name[0]}{student.last_name[0]}
                </ThemedText>
            </View>

            {/* Name & position */}
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
                    {student.first_name} {student.last_name}
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
                    {student.position}
                </ThemedText>
            </View>
        </Pressable>
    );
}

export default function AssignStudents() {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
    const sessionIdNum = sessionId ? Number(sessionId) : 0;

    const [session, setSession] = useState<Session | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set(MOCK_ASSIGNED_IDS));
    const [editMode, setEditMode] = useState(false);
    const [draftIds, setDraftIds] = useState<Set<number>>(new Set(MOCK_ASSIGNED_IDS));

    useEffect(() => {
        getSession(sessionIdNum, 0).then(setSession);
        getStudents(0).then(setStudents);
    }, []);

    const enterEdit = () => {
        setDraftIds(new Set(assignedIds));
        setEditMode(true);
    };

    const saveChanges = () => {
        setAssignedIds(new Set(draftIds));
        setEditMode(false);
    };

    const cancelEdit = () => {
        setDraftIds(new Set(assignedIds));
        setEditMode(false);
    };

    const toggleStudent = (id: number) => {
        const next = new Set(draftIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setDraftIds(next);
    };

    const selectAll = () => setDraftIds(new Set(students.map((s) => s.id)));
    const unselectAll = () => setDraftIds(new Set());

    const currentIds = editMode ? draftIds : assignedIds;
    const allSelected = students.length > 0 && students.every((s) => draftIds.has(s.id));

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
                <Pressable
                    onPress={editMode ? cancelEdit : () => router.back()}
                    hitSlop={8}
                    style={{ marginRight: 8 }}
                >
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
                        {session?.name ?? "Assign Students"}
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: fontSize.sm,
                            color: colors.schemes.light.onSurfaceVariant,
                            letterSpacing: letterSpacing.xl,
                        }}
                    >
                        {assignedIds.size} of {students.length} assigned
                    </ThemedText>
                </View>

                {/* Edit / Cancel button */}
                {!editMode ? (
                    <Pressable
                        onPress={enterEdit}
                        hitSlop={8}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 4,
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: borderRadius.base,
                            borderWidth: 1,
                            borderColor: colors.coreColors.primary,
                        }}
                    >
                        <Pencil size={14} color={colors.coreColors.primary} />
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                fontWeight: 600,
                                color: colors.coreColors.primary,
                            }}
                        >
                            Edit
                        </ThemedText>
                    </Pressable>
                ) : (
                    <Pressable onPress={cancelEdit} hitSlop={8}>
                        <ThemedText
                            style={{
                                fontSize: fontSize.md,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            Cancel
                        </ThemedText>
                    </Pressable>
                )}
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
                        <ThemedText style={{ fontSize: fontSize.lg }}>
                            {session.imageText}
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
                                {session.durationInMins} min
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
                                {session.drills.length} drill{session.drills.length !== 1 ? "s" : ""}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            )}

            {/* Select All / Unselect All — only in edit mode */}
            {editMode && (
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
            )}

            {/* Student list */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    marginTop: editMode ? 0 : margin["3xs"],
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    borderWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderRadius: borderRadius.base,
                    marginHorizontal: margin["3xs"],
                    overflow: "hidden",
                    ...shadow.sm,
                }}
            >
                {students.map((student, i) => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        checked={currentIds.has(student.id)}
                        editMode={editMode}
                        onToggle={() => toggleStudent(student.id)}
                    />
                ))}
            </ScrollView>

            {/* Save Changes button — only in edit mode */}
            {editMode && (
                <View
                    style={{
                        padding: 16,
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        backgroundColor: colors.schemes.light.background,
                    }}
                >
                    <Pressable
                        onPress={saveChanges}
                        style={{
                            backgroundColor: colors.coreColors.primary,
                            borderRadius: borderRadius.base,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            Save Changes
                        </ThemedText>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
