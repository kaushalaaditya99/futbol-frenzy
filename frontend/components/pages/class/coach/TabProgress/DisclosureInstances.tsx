import ThemedText from "@/components/ui/ThemedText";
import DisclosureModal from "./DisclosureModal";
import { BottomScreenProps } from "@/components/ui/BottomScreen";
import { Pressable, ScrollView, View } from "react-native";
import { colors, fontSize, letterSpacing, padding, theme } from "@/theme";
import InputCheckbox from "@/components/ui/input/InputCheckbox";
import { Drill as Drill } from "@/services/drills";
import useSearchBar from "@/hooks/useSearchBar";
import { Session } from "@/services/sessions";
import SearchBar from "@/components/ui/SearchBar";

interface DisclosureInstancesProps extends BottomScreenProps {
    value: number[];
    onChange: (value: number) => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    searchBar: ReturnType<typeof useSearchBar<Drill>> | ReturnType<typeof useSearchBar<Session>>;
}

export default function DisclosureInstances(props: DisclosureInstancesProps) {
    return (
        <DisclosureModal
            title="Select Instances"
            onClose={props.onClose}
        >
            <View
                style={{
                    rowGap: theme.padding.lg,
                    marginBottom: theme.padding.lg,
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
                    Instances
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
                            fontWeight: 400,
                            color: colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {props.value.length === 0 ? "No Instances Selected" : (props.value.length === 1 ? "1 Instance Selected" : `${props.value.length} Instances Selected`)}
                    </ThemedText>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {props.searchBar.filtered.map((instance: Drill|Session, i: number) => (
                    <Pressable 
                        key={i}
                        onPress={() => props.onChange(instance.id)}
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
                            checked={props.value.includes(instance.id)}
                        />
                        <View>
                            <ThemedText
                                style={{
                                    fontWeight: 500,
                                    letterSpacing: letterSpacing.lg
                                }}
                            >
                                {instance.drillName}
                            </ThemedText>
                            <ThemedText
                                style={{
                                    fontSize: fontSize.sm,
                                    fontWeight: 400,
                                    color: colors.schemes.light.onSurfaceVariant,
                                    letterSpacing: letterSpacing.xl,
                                }}
                            >
                                {instance.drillType}
                            </ThemedText>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </DisclosureModal>
    )
}