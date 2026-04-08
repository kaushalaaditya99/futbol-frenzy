import { View, Modal, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { Student } from "@/services/students";
import ThemedText from "@/components/ui/ThemedText";
import { colors, margin, fontSize, borderRadius } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search, MoreHorizontal, UserX } from "lucide-react-native";
import useSearchBar from "@/hooks/useSearchBar";

const AVATAR_COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981"];

interface ManageStudentsProps {
    visible: boolean;
    onClose: () => void;
    students: Student[];
}

export default function ManageStudents(props: ManageStudentsProps) {
    const { search, setSearch, filtered } = useSearchBar(
        props.students,
        (s: any) => `${s.first_name} ${s.last_name}`,
        "first_name"
    );

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    return (
        <Modal animationType="slide" visible={props.visible}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }} edges={["top", "bottom"]}>
                <View style={{
                    flex: 1,
                    backgroundColor: colors.schemes.light.background
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.schemes.light.surface,
                        padding: margin.sm,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}>
                        <Pressable
                            onPress={props.onClose}
                            style={{
                                backgroundColor: colors.schemes.light.surfaceVariant,
                                borderRadius: 20,
                                padding: margin["3xs"],
                            }}
                        >
                            <ChevronLeft size={20} color={colors.schemes.light.onSurface}/>
                        </Pressable>
                        <ThemedText style={{
                            flex: 1,
                            fontSize: fontSize.lg,
                            fontWeight: "600",
                            marginLeft: margin["3xs"],
                        }}>
                            Manage Students
                        </ThemedText>
                    </View>

                    {/* Search Bar */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.schemes.light.surfaceVariant,
                        borderRadius: borderRadius.md,
                        margin: margin.sm,
                        paddingHorizontal: margin["3xs"],
                        paddingVertical: margin["3xs"],
                    }}>
                        <Search size={18} color={colors.schemes.light.onSurfaceVariant}/>
                        <TextInput
                            placeholder="Search students..."
                            placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                            value={search}
                            onChangeText={setSearch}
                            style={{
                                flex: 1,
                                marginLeft: margin["3xs"],
                                fontSize: fontSize.md,
                                color: colors.schemes.light.onSurface,
                            }}
                        />
                    </View>

                    {/* Student List */}
                    <ScrollView style={{ flex: 1 }}>
                        {filtered.map((student: any, index: number) => (
                            <View
                                key={student.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 14,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#F0F0F0",
                                }}
                            >
                                {/* Avatar */}
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <ThemedText style={{
                                        fontSize: 13,
                                        fontWeight: "700",
                                        color: "white",
                                    }}>
                                        {student.first_name[0]}{student.last_name[0]}
                                    </ThemedText>
                                </View>

                                {/* Name and Position */}
                                <View style={{
                                    flex: 1,
                                    marginLeft: 12,
                                }}>
                                    <ThemedText style={{
                                        fontSize: fontSize.md,
                                        fontWeight: "600",
                                        color: colors.schemes.light.onSurface,
                                    }}>
                                        {student.first_name} {student.last_name}
                                    </ThemedText>
                                    <ThemedText style={{
                                        fontSize: 12,
                                        color: colors.schemes.light.outline,
                                        marginTop: 2,
                                    }}>
                                        {student.position}
                                    </ThemedText>
                                </View>

                                {/* More Button */}
                                <Pressable onPress={() => setSelectedStudent(student)}>
                                    <MoreHorizontal size={20} color={colors.schemes.light.outline}/>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Action Sheet */}
                {selectedStudent && !showRemoveConfirm && (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={true}
                    >
                        <Pressable
                            style={{
                                flex: 1,
                                backgroundColor: "#00000035",
                                justifyContent: "flex-end",
                            }}
                            onPress={() => setSelectedStudent(null)}
                        >
                            <View
                                style={{
                                    backgroundColor: colors.schemes.light.surface,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 28,
                                    paddingBottom: 40,
                                }}
                            >
                                {/* Student info header */}
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 20,
                                    paddingBottom: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#F0F0F0",
                                }}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: colors.schemes.light.primary,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <ThemedText style={{
                                            fontSize: 13,
                                            fontWeight: "700",
                                            color: "white",
                                        }}>
                                            {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                                        </ThemedText>
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <ThemedText style={{
                                            fontSize: fontSize.md,
                                            fontWeight: "600",
                                            color: colors.schemes.light.onSurface,
                                        }}>
                                            {selectedStudent.first_name} {selectedStudent.last_name}
                                        </ThemedText>
                                        <ThemedText style={{
                                            fontSize: 12,
                                            color: colors.schemes.light.outline,
                                            marginTop: 2,
                                        }}>
                                            {selectedStudent.position}
                                        </ThemedText>
                                    </View>
                                </View>

                                {/* Action buttons */}
                                <View style={{ gap: 8 }}>
                                    <Pressable
                                        style={{
                                            paddingVertical: 12,
                                            borderRadius: borderRadius.base,
                                            borderWidth: 1.5,
                                            borderColor: colors.schemes.light.outlineVariant,
                                            backgroundColor: "white",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ThemedText style={{
                                            fontSize: 13,
                                            fontWeight: "600",
                                            color: colors.schemes.light.onSurface,
                                        }}>
                                            Change Position
                                        </ThemedText>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setShowRemoveConfirm(true)}
                                        style={{
                                            paddingVertical: 12,
                                            borderRadius: borderRadius.base,
                                            borderWidth: 1.5,
                                            borderColor: "#F44336",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ThemedText style={{
                                            fontSize: 13,
                                            fontWeight: "600",
                                            color: "#F44336",
                                        }}>
                                            Remove Student
                                        </ThemedText>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    </Modal>
                )}

                {/* Remove Confirmation */}
                {selectedStudent && showRemoveConfirm && (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={true}
                    >
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
                                {/* Warning Icon */}
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
                                    <UserX size={28} color="#F44336" />
                                </View>

                                <ThemedText
                                    style={{
                                        fontSize: fontSize.lg,
                                        fontWeight: "700",
                                        color: colors.schemes.light.onSurface,
                                        marginBottom: 8,
                                    }}
                                >
                                    Remove Student?
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
                                    Are you sure you want to remove{" "}
                                    <ThemedText style={{ fontWeight: "700", fontSize: 13 }}>
                                        {selectedStudent.first_name} {selectedStudent.last_name}
                                    </ThemedText>{" "}
                                    from this class?
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        fontSize: 12,
                                        fontWeight: "600",
                                        color: "#F44336",
                                        marginBottom: 20,
                                    }}
                                >
                                    This action cannot be undone.
                                </ThemedText>

                                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                                    <Pressable
                                        onPress={() => {
                                            setShowRemoveConfirm(false);
                                            setSelectedStudent(null);
                                        }}
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
                                                fontWeight: "600",
                                                color: colors.schemes.light.onSurfaceVariant,
                                            }}
                                        >
                                            Cancel
                                        </ThemedText>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => {
                                            // TODO: remove student from class
                                            setShowRemoveConfirm(false);
                                            setSelectedStudent(null);
                                        }}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: borderRadius.base,
                                            backgroundColor: "#F44336",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 13,
                                                fontWeight: "600",
                                                color: "white",
                                            }}
                                        >
                                            Remove
                                        </ThemedText>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </SafeAreaView>
        </Modal>
    )
}