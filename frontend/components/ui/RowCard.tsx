import { borderRadius, colors, fontSize, letterSpacing, padding, shadow } from "@/theme";
import { Pressable, View } from "react-native";
import ThemedText from "./ThemedText";
import { Fragment, ReactNode } from "react";

interface RowCardProps {
    onPress: () => void;
    title: string;
    titleTagClose?: boolean;
    titleTag?: ReactNode;
    descriptions: Array<string>;
    imageText: string;
    imageTextColor: string;
    imageBackgroundColor: string;
    rightElement?: ReactNode;
}

export default function RowCard(props: RowCardProps) {
    const fontSizes = {
        0: fontSize.md,
        1: fontSize.md,
        2: fontSize.md,
        3: fontSize.md,
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
                justifyContent: "space-between",
                backgroundColor: colors.schemes.light.surfaceContainerLowest,
                borderWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                borderStyle: "solid",
                borderRadius: borderRadius.base,
                ...shadow.sm
            }}   
        >
            <View
                style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    columnGap: 8,
                }}
            >
                <View
                    style={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: padding.md,
                        borderRadius: borderRadius.base - 2,
                        backgroundColor: props.imageBackgroundColor || colors.palettes.neutral[90],
                    }}
                >
                    <ThemedText
                        numberLines={1}
                        style={{
                            fontSize: fontSizes[((!props.imageText ? 0 : props.imageText.length) % 4 || 0) as 0|1|2|3],
                            fontWeight: 600,
                            color: props.imageTextColor || "black"
                        }}
                    >
                        {props.imageText && props.imageText.toUpperCase().slice(0, 2)}
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
                            columnGap: 8,
                            justifyContent: props.titleTagClose ? 'flex-start' : "space-between"
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base - 1,
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
                                        fontSize: fontSize.md,
                                        letterSpacing: letterSpacing["xl"],
                                        color: colors.schemes.light.onSurfaceVariant
                                    }}
                                >
                                    {description}
                                </ThemedText>
                                {(props.descriptions && i !== props.descriptions.length - 1) &&
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
            </View>
            {props.rightElement}
        </Pressable>
    )
}