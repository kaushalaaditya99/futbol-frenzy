import InlineRadioButton from "@/components/ui/input/InlineRadioGroup";
import SearchBar, { SearchBarProps } from "@/components/ui/SearchBar";
import { colors, padding } from "@/theme";
import { Calendar, CalendarIcon, CalendarRange, TextAlignJustify } from "lucide-react-native";

interface SessionSearchBarProps extends SearchBarProps {
    viewType: string;
    setViewType: (viewType: string) => void;
}

export default function SessionSearchBar(props: SessionSearchBarProps) {
    return (
        <SearchBar
            {...props}
            containerStyle={{
                flexShrink: 1,
                width: "100%",
            }}
            childrenLeftOfSort={(
                <InlineRadioButton
                    value={props.viewType}
                    onChange={(value: string) => props.setViewType(value)}
                    options={[
                        ["Big",
                            <CalendarRange
                                size={16}
                                color={props.viewType === "Big" ? "black" : colors.schemes.light.onSurfaceVariant}
                            />
                        ],
                        ["Small",
                            <Calendar
                                size={16}
                                color={props.viewType === "Small" ? "black" : colors.schemes.light.onSurfaceVariant}
                            />
                        ]
                    ]}
                    containerStyle={{
                        height: "100%",
                        borderRadius: 0,
                        shadowColor: "transparent"
                    }}
                    optionStyle={{
                        paddingVertical: padding.sm,
                        paddingHorizontal: padding.md,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    selectedOptionStyle={{
                        borderRadius: 6
                    }}
                />
            )}  
        />
    )
}