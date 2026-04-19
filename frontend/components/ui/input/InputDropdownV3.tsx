import ThemedText from '@/components/ui/ThemedText';
import { padding, theme } from '@/theme';
import { CheckIcon, ChevronDown, LucideProps, LucideTableCellsMerge } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, TextStyle, View, ViewStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export interface InputDropdownV3Props<T> {
    values: T[];
    options: Array<[T, string]>;
    setValues: (values: T[]) => void;
    defaultLabel?: string;
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
    svgStyle?: ViewStyle;
    svgProps?: LucideProps;
    labelPrefix?: string;
    objectNamePlural?: string;
}

export default function InputDropdownV3<T>(props: InputDropdownV3Props<T>) {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("");

    useEffect(() => {
        if (props.values === undefined)
            return;
        
        const matched = props.options.filter(([value, label]) => props.values.includes(value));
        
        if (matched.length == 0) {
            setLabel(props.defaultLabel || "Select Option");
        }
        else if (matched.length == 1) {
            const labelIndex = props.options.findIndex(([value, label]) => props.values.includes(value));
            setLabel(`${props.labelPrefix || ""}${props.options[labelIndex][1]}`);
        }
        else {
            setLabel(matched.length + ` ${props.objectNamePlural}` + ` Selected`)
        }
    }, [props.values]);

    return (
        <>
            <DropDownPicker
                listMode="SCROLLVIEW"
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                dropDownDirection="BOTTOM"
                containerStyle={{
                    // flex: 1,
                    minHeight: 32,
                    maxHeight: 32,
                    height: 32,
                    // ...props.containerStyle,  // move this here
                    // backgroundColor: "red",
                    // ...props.buttonStyle,
                    // ...theme.shadow.sm,
                    flexShrink: 1,
                    // overflow: 'hidden',
                }}
                dropDownContainerStyle={{
                    borderColor: theme.colors.schemes.light.outlineVariant,
                    borderRadius: theme.borderRadius.base,
                    borderWidth: 1,
                }}
                listItemLabelStyle={{
                    color: "red"
                }}
                translation={{
                    SELECTED_ITEMS_COUNT_TEXT: label,  // or just hide it
                    NOTHING_TO_SHOW: label,
                }}
                style={{
                    minHeight: 32,
                    maxHeight: 32,
                    height: 32,
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
                    flex: 1,
                    flexShrink: 1,
                    width: '100%',
                    ...props.buttonStyle,
                    ...theme.shadow.sm,
                }}
                textStyle={{
                    fontFamily: 'Arimo',
                    fontWeight: 400,
                    letterSpacing: theme.letterSpacing.xl * 2
                }}
                
                labelStyle={{
                    fontFamily: 'Arimo',
                    
                    textAlignVertical: 'center'
                    // backgroundColor: "blue"
                }}
                renderListItem={(props) => (
                    <Pressable
                        onPress={() => props.onPress(props.item)}
                        style={{
                            minHeight: 32,
                            maxHeight: 32,
                            height: 32,
                            paddingVertical: theme.padding.sm,
                            paddingHorizontal: theme.padding.lg,
                            columnGap: theme.padding.lg,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: theme.borderRadius.base,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            // backgroundColor: props.isSelected ? 'lightblue' : 'white',
                        }}
                    >
                        <ThemedText style={{ fontSize: 14, fontWeight: props.isSelected ? 500 : 400 }}>
                            {props.item.label} {props.isSelected}
                        </ThemedText>
                        {props.isSelected &&
                            <CheckIcon
                                size={16}
                            />
                        }
                    </Pressable>
                )}
                placeholder={label}
                multiple={true}
                open={open}
                value={props.values as any}
                items={props.options.map(([value, label]) => ({value, label}))}
                setOpen={setOpen}
                setValue={props.setValues as any}
                // setItems={setItems}
            />
        </>
    )
}