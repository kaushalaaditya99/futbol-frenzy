import HeaderWithCloseSpacious from "@/components/ui/HeaderWithCloseSpacious";
import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, margin, padding } from "@/theme";
import { View, Modal, ScrollView, Pressable, Switch, TextInput, Alert } from "react-native";
import { useState } from "react";
import InputText from "@/components/ui/input/InputText";
import { Student } from "@/services/students";
import * as Clipboard from "expo-clipboard";
import { ChevronRight, Trash2, Archive } from "lucide-react-native";
import ManageStudents from "./ManageStudents";
import { deleteClass } from "@/services/classes";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

interface SettingsProps {
    onClose: () => void;
    classId?: number;
    className?: string;
    description?: string;
    classCode?: string;
    students?: Student[];
}

const AVATAR_COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981"];

function SectionLabel({ label }: { label: string }) {
    return (
        <ThemedText
            style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: colors.schemes.light.outline,
            }}
        >
            {label}
        </ThemedText>
    );
}

function HintText({ text }: { text: string }) {
    return (
        <ThemedText
            style={{
                fontSize: 11,
                color: colors.schemes.light.outline,
                lineHeight: 16,
            }}
        >
            {text}
        </ThemedText>
    );
}

function ToggleRow({
    label,
    description,
    value,
    onValueChange,
}: {
    label: string;
    description: string;
    value: boolean;
    onValueChange: (val: boolean) => void;
}) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
            }}
        >
            <View style={{ flex: 1, marginRight: 12 }}>
                <ThemedText
                    style={{
                        fontSize: fontSize.md,
                        fontWeight: 600,
                        color: colors.schemes.light.onSurface,
                    }}
                >
                    {label}
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: 11,
                        color: colors.schemes.light.outline,
                        marginTop: 2,
                    }}
                >
                    {description}
                </ThemedText>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{
                    false: "#E0E0E0",
                    true: colors.schemes.light.primary,
                }}
                thumbColor="white"
            />
        </View>
    );
}

function MiniAvatar({ initials, color }: { initials: string; color: string }) {
    return (
        <View
            style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: color,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "white",
                marginLeft: -8,
            }}
        >
            <ThemedText
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                }}
            >
                {initials}
            </ThemedText>
        </View>
    );
}

function DeleteConfirmationModal({
    visible,
    onClose,
    onDelete,
    className,
    studentCount,
}: {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    className: string;
    studentCount: number;
}) {
    const [confirmText, setConfirmText] = useState("");
    const isConfirmed = confirmText === "DELETE";

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#00000050",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: margin.xs,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        maxWidth: 340,
                        backgroundColor: colors.schemes.light.surface,
                        borderRadius: 20,
                        padding: 28,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: "#FFEBEE",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Trash2 size={28} color="#F44336" />
                    </View>
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 700,
                            color: colors.schemes.light.onSurface,
                            marginBottom: 8,
                        }}
                    >
                        Delete Class?
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 13,
                            color: colors.schemes.light.onSurfaceVariant,
                            lineHeight: 20,
                            textAlign: "center",
                            marginBottom: 6,
                        }}
                    >
                        This will permanently delete{" "}
                        <ThemedText style={{ fontWeight: 700, fontSize: 13 }}>
                            {className}
                        </ThemedText>{" "}
                        and remove all {studentCount} students from the class.
                    </ThemedText>
                    <ThemedText
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#F44336",
                            marginBottom: 20,
                        }}
                    >
                        Sessions and drill data will be lost.
                    </ThemedText>

                    <View style={{ width: "100%", marginBottom: 16 }}>
                        <ThemedText
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: colors.schemes.light.onSurface,
                                marginBottom: 6,
                            }}
                        >
                            Type "DELETE" to confirm
                        </ThemedText>
                        <TextInput
                            value={confirmText}
                            onChangeText={(text) => setConfirmText(text.toUpperCase())}
                            placeholder="DELETE"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            style={{
                                width: "100%",
                                paddingVertical: padding.md,
                                paddingHorizontal: padding.lg,
                                fontSize: fontSize.md,
                                fontFamily: "Arimo-Regular",
                                fontWeight: "700",
                                letterSpacing: 2,
                                textAlign: "center",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                borderRadius: borderRadius.sm,
                                backgroundColor: colors.schemes.light.background,
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                        <Pressable
                            onPress={onClose}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: borderRadius.base,
                                borderWidth: 1.5,
                                borderColor: colors.schemes.light.outlineVariant,
                                alignItems: "center",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: colors.schemes.light.onSurfaceVariant,
                                }}
                            >
                                Cancel
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={isConfirmed ? onDelete : undefined}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: borderRadius.base,
                                backgroundColor: "#F44336",
                                alignItems: "center",
                                opacity: isConfirmed ? 1 : 0.5,
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "white",
                                }}
                            >
                                Delete
                            </ThemedText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function Settings(props: SettingsProps) {
    const [className, setClassName] = useState(props.className ?? "");
    const [description, setDescription] = useState(props.description ?? "");
    const classCode = props.classCode ?? "XK7M2P";
    const students = props.students ?? [];

    const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
    const [showAIFeedback, setShowAIFeedback] = useState(true);
    const [notifyOnSubmissions, setNotifyOnSubmissions] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [showManageStudents, setShowManageStudents] = useState(false);

    const handleCopyCode = async () => {
        await Clipboard.setStringAsync(classCode);
        Alert.alert("Copied!", "Class code copied to clipboard.");
    };

    const { token } = useAuth();

    const handleDelete = async () => {
        if (token && props.classId) {
            const success = await deleteClass(token, props.classId);
            if (success) {
                setShowDeleteConfirmation(false);
                props.onClose();
                router.replace("/(tabs)/classes");
            } else {
                Alert.alert("Error", "Failed to delete class. Please try again.");
            }
        }
    };

    const getStudentInitials = (student: Student) =>
        `${student.first_name[0]}${student.last_name[0]}`;

    const visibleStudents = students.slice(0, 4);
    const remainingCount = Math.max(0, students.length - 4);

    return (
        <Modal visible={true} transparent={true} animationType="fade">
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#00000035",
                    justifyContent: "center",
                    padding: margin.xs,
                }}
            >
                <View
                    style={{
                        maxHeight: "85%",
                        backgroundColor: colors.schemes.light.surface,
                        borderRadius: 20,
                        overflow: "hidden",
                    }}
                >
                    <View
                        style={{
                            padding: margin.xs,
                            paddingBottom: padding.lg,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.schemes.light.outlineVariant,
                        }}
                    >
                        <HeaderWithCloseSpacious
                            header="Settings"
                            onClose={props.onClose}
                        />
                    </View>
                    <ScrollView
                        style={{
                            padding: margin.xs,
                        }}
                        contentContainerStyle={{
                            paddingBottom: 40,
                            rowGap: 20,
                        }}
                    >
                        {/* Class Info */}
                        <SectionLabel label="Class Info" />
                        <InputText
                            label="Class Name"
                            value={className}
                            onChangeText={setClassName}
                        />
                        <InputText
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Add a description (optional)"
                        />
                        <HintText text="Visible to students when they join" />

                        {/* Invite Students */}
                        <SectionLabel label="Invite Students" />
                        <View>
                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: colors.schemes.light.onSurface,
                                    marginBottom: 6,
                                }}
                            >
                                Class Code
                            </ThemedText>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.schemes.light.background,
                                    borderRadius: borderRadius.base,
                                    padding: 12,
                                    borderWidth: 1.5,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    gap: 10,
                                }}
                            >
                                <ThemedText
                                    style={{
                                        flex: 1,
                                        fontSize: 20,
                                        fontWeight: 800,
                                        letterSpacing: 4,
                                        color: colors.schemes.light.onSurface,
                                    }}
                                >
                                    {classCode}
                                </ThemedText>
                                <Pressable
                                    onPress={handleCopyCode}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 14,
                                        borderRadius: 8,
                                        backgroundColor: colors.schemes.light.primary,
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: "white",
                                        }}
                                    >
                                        Copy
                                    </ThemedText>
                                </Pressable>
                            </View>
                            <HintText text="Students enter this code to join your class" />
                        </View>

                        <View style={{ flexDirection: "row", gap: 8 }}>
                            <Pressable
                                onPress={() => {}}
                                style={{
                                    flex: 1,
                                    paddingVertical: 8,
                                    paddingHorizontal: 14,
                                    borderRadius: 8,
                                    borderWidth: 1.5,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    backgroundColor: "white",
                                    alignItems: "center",
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: colors.schemes.light.onSurface,
                                    }}
                                >
                                    Share Link
                                </ThemedText>
                            </Pressable>
                            <Pressable
                                onPress={() => {}}
                                style={{
                                    flex: 1,
                                    paddingVertical: 8,
                                    paddingHorizontal: 14,
                                    borderRadius: 8,
                                    borderWidth: 1.5,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    backgroundColor: "white",
                                    alignItems: "center",
                                }}
                            >
                                <ThemedText
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: colors.schemes.light.onSurface,
                                    }}
                                >
                                    Reset Code
                                </ThemedText>
                            </Pressable>
                        </View>

                        {/* Students */}
                        <SectionLabel label="Students" />
                        <Pressable
                            onPress={() => setShowManageStudents(true)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: colors.schemes.light.background,
                                borderRadius: borderRadius.base,
                                padding: 14,
                            }}
                        >
                            {visibleStudents.length > 0 && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingLeft: 8,
                                        marginRight: 12,
                                    }}
                                >
                                    {visibleStudents.map((student, i) => (
                                        <MiniAvatar
                                            key={student.id}
                                            initials={getStudentInitials(student)}
                                            color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                                        />
                                    ))}
                                    {remainingCount > 0 && (
                                        <View
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 15,
                                                backgroundColor: "#E0E0E0",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderWidth: 2,
                                                borderColor: "white",
                                                marginLeft: -8,
                                            }}
                                        >
                                            <ThemedText
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: colors.schemes.light.onSurfaceVariant,
                                                }}
                                            >
                                                +{remainingCount}
                                            </ThemedText>
                                        </View>
                                    )}
                                </View>
                            )}
                            <View style={{ flex: 1 }}>
                                <ThemedText
                                    style={{
                                        fontSize: fontSize.md,
                                        fontWeight: "600",
                                        color: colors.schemes.light.onSurface,
                                    }}
                                >
                                    Manage Students
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        fontSize: 12,
                                        color: colors.schemes.light.outline,
                                    }}
                                >
                                    {students.length === 0 ? "No students yet" : `${students.length} students`}
                                </ThemedText>
                            </View>
                            <ChevronRight
                                size={16}
                                color={colors.schemes.light.outline}
                            />
                        </Pressable>

                        {/* Preferences */}
                        <SectionLabel label="Preferences" />
                        <View>
                            <ToggleRow
                                label="Allow Late Submissions"
                                description="Students can submit after session due date"
                                value={allowLateSubmissions}
                                onValueChange={setAllowLateSubmissions}
                            />
                            <ToggleRow
                                label="Show AI Feedback to Students"
                                description="Students see AI analysis alongside your grade"
                                value={showAIFeedback}
                                onValueChange={setShowAIFeedback}
                            />
                            <ToggleRow
                                label="Notify on Submissions"
                                description="Get push notifications when students submit"
                                value={notifyOnSubmissions}
                                onValueChange={setNotifyOnSubmissions}
                            />
                        </View>

                        {/* Save Button */}
                        <Pressable
                            onPress={() => {
                                props.onClose();
                            }}
                            style={{
                                width: "100%",
                                paddingVertical: 14,
                                borderRadius: borderRadius.base,
                                backgroundColor: colors.schemes.light.primary,
                                alignItems: "center",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "white",
                                }}
                            >
                                Save Changes
                            </ThemedText>
                        </Pressable>

                        {/* Danger Zone */}
                        <View
                            style={{
                                borderWidth: 1.5,
                                borderColor: "#FFEBEE",
                                borderRadius: borderRadius.lg,
                                padding: 16,
                                backgroundColor: "#FFFAFA",
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#F44336",
                                    marginBottom: 12,
                                }}
                            >
                                Danger Zone
                            </ThemedText>
                            <View style={{ gap: 8 }}>
                                <Pressable
                                    onPress={() => setShowDeleteConfirmation(true)}
                                    style={{
                                        width: "100%",
                                        paddingVertical: 12,
                                        borderRadius: borderRadius.base,
                                        borderWidth: 1.5,
                                        borderColor: "#F44336",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        gap: 6,
                                    }}
                                >
                                    <Trash2 size={16} color="#F44336" />
                                    <ThemedText
                                        style={{
                                            fontSize: fontSize.md,
                                            fontWeight: 600,
                                            color: "#F44336",
                                        }}
                                    >
                                        Delete Class
                                    </ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                visible={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onDelete={handleDelete}
                className={className}
                studentCount={students.length}
            />

            {/* Manage Students Modal */}
            <ManageStudents
                visible={showManageStudents}
                onClose={() => setShowManageStudents(false)}
                students={students}
            />
        </Modal>
    );
}
