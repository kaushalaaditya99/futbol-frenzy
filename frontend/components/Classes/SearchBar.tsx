import { colors, shadow } from "@/theme";
import { ArrowDownUp, Search } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

interface SearchProps {
    search: string;
    setSearch: (search: string) => void;
    onSearch: () => void;
    sortDirection: 0|1|2;
    setSortDirection: (sortDirection: 0|1|2) => void;
}

export default function SearchBar(props: SearchProps) {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: 8,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                ...shadow.sm
            }}
        >
            <TextInput
                value={props.search}
                onChangeText={(text) => props.setSearch(text)}
                style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    color: "black",
                    fontFamily: "Inter_400Regular"
                }}
                placeholderTextColor={colors.schemes.light.onSurfaceVariant}
                placeholder="Search Classes..."
            />
            <Pressable
                onPress={() => props.setSortDirection((props.sortDirection + 1) % 3 as 0|1|2)}
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderLeftWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderStyle: "solid",
                    backgroundColor: colors.schemes.light.surfaceContainerLow,
                }}
            >
                <ArrowDownUp
                    size={18}
                    color={props.sortDirection === 0 ? colors.schemes.light.onSurfaceVariant : props.sortDirection === 1 ? "#307351" : "#D7263D"}
                />
            </Pressable>
            <Pressable
                onPress={props.onSearch}
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderLeftWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant,
                    borderStyle: "solid",
                    backgroundColor: colors.schemes.light.surfaceContainerLow,
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8
                }}
            >
                <Search
                    size={18}
                    color={colors.schemes.light.onSurfaceVariant}
                />
            </Pressable>
        </View>
    )
}