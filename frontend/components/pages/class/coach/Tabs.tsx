import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, letterSpacing, padding } from "@/theme";
import { Pressable, View } from "react-native";

interface TabsProps {
    tab: string;
    tabs: Array<string>;
    setTab: (tab: string) => void;
}

export default function Tabs(props: TabsProps) {
    return (
        <View
            style={{
                flexDirection: "row",
            }}
        >
            {props.tabs.map((tab, i) => (
                <Pressable
                    key={i}
                    onPress={() => props.setTab(tab)}
                    style={{
                        paddingVertical: padding.lg,
                        paddingHorizontal: padding.sm,
                        flex: 1,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderLeftWidth: (i === 0 || props.tabs[i - 1] === props.tab) ? 0 : 1,
                        borderColor: tab === props.tab ? colors.coreColors.primary : colors.schemes.light.outlineVariant,
                        backgroundColor: (tab === props.tab) ? colors.coreColors.primary : colors.schemes.light.surfaceContainerHigh
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.xs,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.lg,
                            textAlign: "center",
                            color: tab === props.tab ? "white" : colors.schemes.light.onSurfaceVariant
                        }}
                    >
                        {tab.toUpperCase()}
                    </ThemedText>
                </Pressable>
            ))}
        </View>
    )
}