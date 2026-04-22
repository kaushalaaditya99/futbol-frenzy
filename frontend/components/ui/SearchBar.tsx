import { borderRadius, colors, margin, padding, shadow } from "@/theme";
import { ArrowDown, ArrowDownUp, ArrowUp, MoveDown, MoveUp, Search } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";
import SearchBarSort from "./SearchBarSort";

export interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
    onSearch?: () => void;
    placeholder?: string;
    enableSort?: boolean;
    sortDirection?: 0|1|2;
    setSortDirection?: (sortDirection: 0|1|2) => void;
    childrenLeftOfSort?: ReactNode;
    childrenRightOfSort?: ReactNode;
    textInputStyle?: TextStyle;
    sortButtonStyle?: ViewStyle;
    sortButtonSVGStyle?: ViewStyle;
    searchButtonStyle?: ViewStyle;
    searchButtonSVGStyle?: ViewStyle;
    containerStyle?: ViewStyle;
}

export default function SearchBar(props: SearchBarProps) {
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
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: borderRadius.base,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                ...shadow.sm,
                ...props.containerStyle
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
                    ...props.textInputStyle,
                }}
                placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                placeholder={props.placeholder}
            />
            {props.childrenLeftOfSort}
            {(props.enableSort && props.sortDirection !== undefined) &&
                <SearchBarSort
                    sortDirection={props.sortDirection}
                    updateSortDirection={updateSortDirection}
                    sortButtonStyle={{
                        ...props.sortButtonStyle
                    }}
                    sortButtonSVGStyle={{
                        ...props.sortButtonSVGStyle
                    }}
                />
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
                    size={props?.searchButtonSVGStyle?.width as any || 18}
                    color={colors.schemes.light.onSurfaceVariant}
                    style={props.searchButtonSVGStyle}
                />
            </Pressable>
        </View>
    )
}