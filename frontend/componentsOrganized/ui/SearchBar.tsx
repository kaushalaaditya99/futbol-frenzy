import { borderRadius, colors, margin, padding, shadow } from "@/theme";
import { ArrowDown, ArrowDownUp, ArrowUp, Search } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";

interface SearchProps {
    search: string;
    setSearch: (search: string) => void;
    onSearch: () => void;
    placeholder?: string;
    enableSort?: boolean;
    sortDirection?: 0|1|2;
    setSortDirection?: (sortDirection: 0|1|2) => void;
    childrenLeftOfSort?: ReactNode;
    childrenRightOfSort?: ReactNode;
    textInputStyle?: TextStyle;
    searchButtonStyle?: ViewStyle;
    searchButtonSVGStyle?: ViewStyle;
}

export default function SearchBar(props: SearchProps) {
    const updateSortDirection = (direction: number) => {
        const nextDirection = (direction + 1) % 3 as 0|1|2;
        props.setSortDirection && props.setSortDirection(nextDirection);
    }

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: margin.sm,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: borderRadius.base,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                ...shadow.sm
            }}
        >
            <TextInput
                value={props.search}
                onChangeText={(text) => props.setSearch(text)}
                style={{
                    flex: 1,
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    color: "black",
                    fontFamily: "Arimo-Regular",
                    ...props.textInputStyle
                }}
                placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                placeholder={props.placeholder}
            />
            {props.childrenLeftOfSort}
            {props.enableSort &&
                <Pressable
                    onPress={() => props.sortDirection && updateSortDirection(props.sortDirection)}
                    style={{
                        paddingVertical: padding.md,
                        paddingHorizontal: padding.lg,
                        borderLeftWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        backgroundColor: colors.schemes.light.surfaceContainerLow,
                    }}
                >
                    {props.sortDirection === 0 &&
                        <ArrowDownUp
                            size={18}
                            color={colors.schemes.light.onSurfaceVariant}
                        />
                    }
                    {props.sortDirection === 1 &&
                        <ArrowUp
                            size={18}
                            color={"#307351"}
                        />
                    }
                    {props.sortDirection === 2 &&
                        <ArrowDown
                            size={18}
                            color={"#D7263D"}
                        />
                    }
                </Pressable>
            }
            {props.childrenRightOfSort}
            <Pressable
                onPress={props.onSearch}
                style={{
                    paddingVertical: padding.md,
                    paddingHorizontal: padding.lg,
                    borderLeftWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    backgroundColor: colors.schemes.light.surfaceContainerLow,
                    borderTopRightRadius: borderRadius.base,
                    borderBottomRightRadius: borderRadius.base,
                    ...props.searchButtonStyle
                }}
            >
                <Search
                    size={18}
                    color={colors.schemes.light.onSurfaceVariant}
                    style={props.searchButtonSVGStyle}
                />
            </Pressable>
        </View>
    )
}