import { View, Modal, ScrollView, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { Student } from "@/services/students";
import ThemedText from "@/components/ui/ThemedText";
import { colors, margin, fontSize, borderRadius, padding } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search, MoreHorizontal } from "lucide-react-native";
import useSearchBar from "@/hooks/useSearchBar";

interface ManageStudentsProps {
    visible: boolean;
    onClose: () => void;
    students: Student[];
}

export default function ManageStudents(props: ManageStudentsProps) {
    const { search, setSearch, filtered } = useSearchBar(
        props.students,
        (s: any) => `${s.fName} ${s.lName}`,
        "fName"
    );

    return (
        <Modal animationType="slide" visible={props.visible}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
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
                        {filtered.map((student: any) => (
                            <View
                                key={student.id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: padding.sm,
                                    paddingHorizontal: margin.sm,
                                    borderBottomWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                {/* Avatar */}
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: colors.schemes.light.surfaceVariant,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <ThemedText style={{
                                        fontSize: fontSize.md,
                                        fontWeight: "600",
                                        color: colors.schemes.light.onSurfaceVariant,
                                    }}>
                                        {student.fName[0]}{student.lName[0]}
                                    </ThemedText>
                                </View>

                                {/* Name and Position */}
                                <View style={{
                                    flex: 1,
                                    marginLeft: margin["3xs"],
                                }}>
                                    <ThemedText style={{
                                        fontSize: fontSize.md,
                                        fontWeight: "500",
                                        color: colors.schemes.light.onSurface,
                                    }}>
                                        {student.fName} {student.lName}
                                    </ThemedText>
                                    <ThemedText style={{
                                        fontSize: fontSize.sm,
                                        color: colors.schemes.light.onSurfaceVariant,
                                    }}>
                                        {student.position}
                                    </ThemedText>
                                </View>

                                {/* More Button */}
                                <Pressable>
                                    <MoreHorizontal size={20} color={colors.schemes.light.onSurfaceVariant}/>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    )
}