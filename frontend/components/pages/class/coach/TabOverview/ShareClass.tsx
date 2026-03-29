import BottomScreen, { BottomScreenProps } from "@/components/ui/BottomScreen";
import ThemedText from "@/components/ui/ThemedText";
import { shadow, theme } from "@/theme";
import { CheckIcon, CopyIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Pressable, View } from "react-native";

interface ShareClassProps extends BottomScreenProps {
    classCode?: string;
}

export default function ShareClass(props: ShareClassProps) {
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        if (!showCheck)
            return;
        setTimeout(() => {
            setShowCheck(false);
        }, 5000);
    }, [showCheck]);

    return (
        <BottomScreen
            {...props}
            fitContent
            title="Share Class"
        >
            <View
                style={{
                    flex: 1,
                    // justifyContent: "center"
                }}
            >
                <View
                    style={{
                        padding: theme.padding.xl,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        columnGap: theme.padding.lg,
                        borderWidth: 1,
                        borderRadius: theme.borderRadius.lg,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        backgroundColor: "white",
                        ...shadow.sm,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: theme.fontSize["4xl"],
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl * 4
                        }}
                    >
                        {props.classCode}
                    </ThemedText>
                    <Pressable
                        onPress={async () => {
                            await Clipboard.setStringAsync(props.classCode || "");
                            setShowCheck(true)
                        }}
                        style={{
                            padding: theme.padding.lg,
                            borderRadius: theme.borderRadius.lg,
                            borderWidth: 1,
                            borderColor: theme.colors.schemes.light.outlineVariant,
                            backgroundColor: "white",
                            ...theme.shadow.sm
                        }}
                    >
                        {showCheck &&
                            <CheckIcon
                                size={40}
                                color={"#2dad36"}
                            />
                        }
                        {!showCheck &&
                            <CopyIcon
                                size={40}
                                color={theme.colors.schemes.light.onSurfaceVariant}
                            />
                        }
                    </Pressable>
                </View>
                <ThemedText
                    style={{
                        marginTop: theme.padding.md,
                        fontSize: theme.fontSize.base,
                        letterSpacing: theme.letterSpacing.xl * 2,
                        color: theme.colors.schemes.light.onSurfaceVariant,
                        textAlign: "center"
                    }}
                >
                    Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
                </ThemedText>
            </View>
        </BottomScreen>
    )
}