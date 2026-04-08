import DisclosureModal from "./DisclosureModal";
import { Student } from "@/services/students";
import useSearchBar from "@/hooks/useSearchBar";
import { BottomScreenProps } from "@/components/ui/BottomScreen";
import SearchBar from "@/components/ui/SearchBar";
import { Fragment, useEffect } from "react";
import RowCardStudent from "../TabStudent/RowCardStudent";
import { Pressable, ScrollView, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing, padding, shadow, theme } from "@/theme";
import { CheckIcon } from "lucide-react-native";
import InputCheckbox from "@/components/ui/input/InputCheckbox";

interface DisclosureStudentsProps extends BottomScreenProps {
    value: number[];
    onChange: (value: number) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    searchBar: ReturnType<typeof useSearchBar<Student>>;
    className: string
}

export default function DisclosureStudents(props: DisclosureStudentsProps) {
    useEffect(() => {
        props.onDeselectAll();
    }, [props.searchBar.search]);

    return (
        <DisclosureModal
            title="Select Students"
            onClose={props.onClose}
        >
            <View
                style={{
                    rowGap: theme.padding.lg,
                    paddingTop: theme.padding.lg,
                    borderTopWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 16,
                        fontWeight: 500,
                        letterSpacing: letterSpacing.lg
                    }}
                >
                    {/* <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: colors.coreColors.primary
                        }}
                    >
                        {`${props.className} `}
                    </ThemedText> */}
                     Students
                </ThemedText>
                <SearchBar
                    search={props.searchBar.search}
                    setSearch={props.searchBar.setSearch}
                    enableSort={true}
                    sortDirection={props.searchBar.sortDirection}
                    setSortDirection={props.searchBar.setSortDirection}
                    
                    textInputStyle={{
                        paddingVertical: 6,
                        // paddingHorizontal: 6
                    }}
                    sortButtonStyle={{
                        paddingVertical: 6,
                        // paddingHorizontal: 6
                    }}
                    searchButtonStyle={{
                        paddingVertical: 6,
                        // paddingHorizontal: 6
                    }}
                    searchButtonSVGStyle={{
                        width: 16
                    }}
                    sortButtonSVGStyle={{
                        width: 16
                    }}
                />
                <View
                    style={{
                        paddingBottom: padding.lg,
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: padding.md,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <InputCheckbox
                        checked={props.searchBar.filtered.length === props.value.length}
                    />
                    <ThemedText
                        style={{
                            // fontSize: fontSize.base,
                            fontWeight: 400,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props.value.length === 0 ? "No Students Selected" : (props.value.length === 1 ? "1 Student Selected" : `${props.value.length} Students Selected`)}
                    </ThemedText>
                </View>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {props.searchBar.filtered.map((student: Student, i: number) => (
                        <Pressable 
                            key={i}
                            onPress={() => props.onChange(student.id)}
                            style={{
                                width: "auto",
                                height: "auto",
                                marginBottom: padding.lg,
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: padding.md
                            }}
                        >
                            <InputCheckbox
                                checked={props.value.includes(student.id)}
                            />
                            <View>
                                <ThemedText
                                    style={{
                                        fontWeight: 500,
                                        letterSpacing: letterSpacing.lg
                                    }}
                                >
                                    {student.first_name} {student.last_name}
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        fontSize: fontSize.sm,
                                        fontWeight: 400,
                                        color: colors.schemes.light.onSurfaceVariant,
                                        letterSpacing: letterSpacing.xl,
                                    }}
                                >
                                    {student.position}
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </DisclosureModal>
    )
}