import { theme } from "@/theme";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react-native";
import { Pressable, ViewStyle } from "react-native";

interface SearchBarSortProps {
    sortDirection: 0|1|2;
    updateSortDirection: (direction: number) => void;
    sortButtonStyle?: ViewStyle;
}

export default function SearchBarSort(props: SearchBarSortProps) {
    return (
        <Pressable
            onPress={() => props.sortDirection !== undefined && props.updateSortDirection(props.sortDirection)}
            style={{
                paddingVertical: theme.padding.md,
                paddingHorizontal: theme.padding.lg,
                borderLeftWidth: 1,
                borderColor: theme.colors.schemes.light.outlineVariant,
                backgroundColor: theme.colors.schemes.light.surfaceContainerLow,
                ...props.sortButtonStyle
            }}
        >
            {props.sortDirection === 0 &&
                <ArrowDownUp
                    size={18}
                    color={theme.colors.schemes.light.onSurfaceVariant}
                />
            }
            {props.sortDirection === 1 &&
                <MoveUp
                    size={18}
                    color={"#307351"}
                />
            }
            {props.sortDirection === 2 &&
                <MoveDown
                    size={18}
                    color={"#D7263D"}
                />
            }
        </Pressable>
    )
}