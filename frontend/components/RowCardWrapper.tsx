import { colors, fontSize, letterSpacing, shadow } from "@/theme";
import { Pressable, View } from "react-native";
import ThemedText from "./ThemedText";
import { Fragment, ReactNode } from "react";

interface RowCardWrapperProps {
    onPress: () => void;
    title: string;
    descriptions: Array<string>;
    imageBackgroundColor: string;
    imageTextColor: string;
    imageText: string;
    titleTag?: ReactNode;
}

export default function RowCardWrapper(props: RowCardWrapperProps) {
    const fontSizes = {
        0: fontSize.sm,
        1: fontSize.xl,
        2: fontSize.md,
        3: fontSize.sm,
    }

    return (
        <Pressable
            onPress={props.onPress}
            style={{
                paddingVertical: 8,
                paddingHorizontal: 8,
                display: "flex",
                flexDirection: "row",
                columnGap: 8,
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: 12,
                ...shadow.md
            }}   
        >
            <View
                style={{
                    width: 48,
                    height: 48,
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: props.imageBackgroundColor || colors.palettes.neutral[90],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ThemedText
                    numberLines={1}
                    style={{
                        fontSize: fontSizes[(props.imageText.length % 4 || 0) as 0|1|2|3],
                        fontWeight: 500,
                        color: props.imageTextColor || "black"
                    }}
                >
                    {props.imageText.toUpperCase().slice(0, 3)}
                </ThemedText>
            </View>
            <View
                style={{
                    flex: 1,
                    rowGap: 2
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.md,
                            fontWeight: 500,
                            letterSpacing: letterSpacing.base,
                            color: colors.schemes.light.onSurface
                        }}
                    >
                        {props.title}
                    </ThemedText>
                    {props.titleTag}
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 8
                    }}
                >
                    {props.descriptions.map((description, i) => (
                        <Fragment
                            key={i}
                        >
                            <ThemedText
                                style={{
                                    fontSize: fontSize.sm,
                                    letterSpacing: letterSpacing["xl"],
                                    color: colors.schemes.light.onSurfaceVariant
                                }}
                            >
                                {description}
                            </ThemedText>
                            {i !== props.descriptions.length - 1 &&
                                <View
                                    style={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: 100,
                                        backgroundColor: colors.schemes.light.onSurfaceVariant
                                    }}
                                />
                            }
                        </Fragment>
                    ))}
                </View>
            </View>
        </Pressable>
    )
}