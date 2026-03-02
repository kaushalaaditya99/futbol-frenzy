import { colors, padding, shadow } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { MoveRight } from "lucide-react-native";

interface ViewAllButtonProps {
    onPress?: () => void;
}

export default function ViewAllButton(props: ViewAllButtonProps) {
    return (
        <Pressable
            onPress={props.onPress}
            style={{
                padding: 1,
                backgroundColor: "#2989ff",
                borderRadius: 10,
                ...shadow.md,

            }}
        >
            <LinearGradient
                colors={[
                    "#FFFFFF5A", 
                    colors.coreColors.primary
                ]}
                start={{ 
                    x: 0, 
                    y: 0 
                }}
                end={{ 
                    x: 0, 
                    y: 1 
                }}
                style={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: padding.sm,
                    borderRadius: 10,
                }}
            >
                <View
                    style={{
                        paddingVertical: padding.lg,
                        paddingHorizontal: padding.lg,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 6,
                        borderRadius: 8,
                        backgroundColor: colors.coreColors.primary,
                    }}
                >
                    <ThemedText
                        style={{
                            flex: 1,
                            color: colors.schemes.light.onPrimary,
                            fontSize: 14,
                            fontWeight: 500,
                            textAlign: "right",
                        }}
                    >
                        View All
                    </ThemedText>
                    <MoveRight
                        size={16}
                        strokeWidth={2.5}
                        color={colors.schemes.light.onPrimary}
                    />
                </View>
            </LinearGradient>
        </Pressable>
    )
}