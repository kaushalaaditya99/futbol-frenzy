import ThemedText from '@/components/ui/ThemedText';
import { padding, theme } from '@/theme';
import {Picker} from '@react-native-picker/picker';
import { ChevronDown, LucideProps, LucideTableCellsMerge } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, TextStyle, View, ViewStyle } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export interface InputDropdownV2Props {
    value: string;
    options: Array<[string, string]>;
    onChange: (value: string) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    svgStyle?: ViewStyle;
    svgProps?: LucideProps;
    labelPrefix?: string;
}

export default function InputDropdownV2(props: InputDropdownV2Props) {
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (props.value === undefined)
            return;
        const labelIndex = props.options.findIndex(([value, label]) => value === props.value);
        if (labelIndex !== -1)
            setLabel(`${props.labelPrefix || ""}${props.options[labelIndex][1]}`);
        else
            setLabel("");
    }, [props.value]);

    return (
        <View
            style={{
                ...theme.shadow.sm,
                ...props.containerStyle
            }}
        >
            <RNPickerSelect
                items={props.options.map(([value, label]) => ({value, label}))}
                onValueChange={props.onChange}
                placeholder={{}}
            >
                <Pressable
                    pointerEvents="none"
                    style={{
                        paddingVertical: theme.padding.sm,
                        paddingHorizontal: theme.padding.lg,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        columnGap: theme.padding.md,
                        borderWidth: 1,
                        borderColor: theme.colors.schemes.light.outlineVariant,
                        borderRadius: theme.borderRadius.base,
                        backgroundColor: "white",
                        ...props.buttonStyle
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: theme.letterSpacing.xl,
                            color: theme.colors.schemes.light.onSurface,
                            ...props.textStyle
                        }}
                    >
                        {label || props.placeholder}
                    </ThemedText>
                    <ChevronDown
                        size={16}
                        strokeWidth={2.25}
                        color={theme.colors.schemes.light.onSurfaceVariant}
                        {...props.svgProps}
                        style={{
                            ...props.svgStyle
                        }}
                    />
                </Pressable>
            </RNPickerSelect>
        </View>
    )
}