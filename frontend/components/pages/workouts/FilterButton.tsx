import Button, { ButtonProps } from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import ThemedText from "@/components/ui/ThemedText";
import { theme } from "@/theme";
import { FilterIcon } from "lucide-react-native";

export default function FilterButton(props: Omit<ButtonProps, "children">) {
    return (
        <Button
            {...buttonTheme.white}
            onPress={props.onPress}
            outerStyle={{
                height: 36,
                minHeight: 36,
                maxHeight: 36,
            }}
            innerMostStyle={{
                paddingVertical: 0,
                paddingHorizontal: 0
            }}
        >
            <FilterIcon
                size={14}
                strokeWidth={2.5}
                color={theme.colors.schemes.light.onSurfaceVariant}
            />
            <ThemedText
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: theme.letterSpacing.xl,
                    color: theme.colors.schemes.light.onSurface
                }}
            >
                Filter
            </ThemedText>
        </Button>
    )
}