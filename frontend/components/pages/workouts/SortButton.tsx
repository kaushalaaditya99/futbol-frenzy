import InputDropdownV2 from "@/components/ui/input/InputDropdownV2";
import useWorkoutSearch from "./useWorkoutSearch";
import { theme } from "@/theme";
import SearchBarSort from "@/components/ui/SearchBarSort";
import { View } from "react-native";

interface SortButtonProps {
    searchBar: ReturnType<typeof useWorkoutSearch>;
}

export default function SortButton(props: SortButtonProps) {
    return (
        <View
            style={{
                height: 36,
                minHeight: 36,
                maxHeight: 36,
                flex: 1,
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "row",
            }}
        >
            <InputDropdownV2
                value={props.searchBar.sortKey}
                onChange={props.searchBar.setSortKey}
                options={props.searchBar.sortKeysOptions as [string, string][]}
                containerStyle={{
                    flex: 1,
                }}
                buttonStyle={{
                    height: "100%",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRightWidth: 0,
                }}
                labelPrefix="Sort by "
            />
            <SearchBarSort
                sortDirection={props.searchBar.sort}
                updateSortDirection={(direction: number) => props.searchBar.setSort(props.searchBar.getNextDirection(direction))}
                sortButtonStyle={{
                    borderWidth: 1,
                    borderRightWidth: 1,
                    borderTopRightRadius: theme.borderRadius.base,
                    borderBottomRightRadius: theme.borderRadius.base,
                    ...theme.shadow.sm
                }}
            />
        </View>
    )
}