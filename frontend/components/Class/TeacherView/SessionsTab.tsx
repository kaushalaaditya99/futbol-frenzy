import { Pressable, TextInput, View } from "react-native";
import CreateSessionButton from "./CreateSessionButton";
import ShareButton from "./ShareButton";
import SettingsButton from "./SettingsButton";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import ThemedText from "@/components/ThemedText";
import InlineRadioButton from "@/components/InlineRadioButton";
import { ArrowUpDown, CalendarIcon, Search, TextAlignJustify, TreePalm } from "lucide-react-native";
import FunctionalDateLarge from "@/components/Home/FunctionalDate";
import useFunctionalDate from "@/hooks/useFunctionalDate";
import Calendar from "@/components/Calendar";
import { Fragment } from "react";
import CardSession from "@/components/Home/CardSession";
import { Session } from "@/services/sessions";
import { MarkedDates } from "react-native-calendars/src/types";
import AssignSessionButton from "./AssignSessionButton";

interface SessionsTabProps {
    sessionsViewType: "Calendar"|"List";
    setSessionsViewType: (view: "Calendar"|"List") => void;
    sessionsOnDate: Array<Session>;
    sessionsOnDateLabel: string;
    functionalDate: ReturnType<typeof useFunctionalDate>;
    multiDotMarkedDates: MarkedDates;
}

export default function SessionsTab(props: SessionsTabProps) {
    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background
            }}
        >
            <View
                style={{
                    paddingVertical: margin["3xs"],
                    paddingHorizontal: margin["3xs"],
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    columnGap: margin["3xs"],
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <AssignSessionButton
                    onPress={() => 1}
                />
                <CreateSessionButton
                    onPress={() => 1}
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingBottom: props.sessionsViewType === "List" ? 0 : undefined,
                    paddingHorizontal: margin.sm,
                    rowGap: padding.lg,
                }}
            >
                <View
                    style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            columnGap: padding.xl,
                        }}
                >
                    <ThemedText
                        style={{
                            fontWeight: 500,
                            fontSize: fontSize.lg,
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onBackground,
                        }}
                    >
                        Sessions
                    </ThemedText>
                </View>
                <View
                    style={{
                        flexShrink: 1,
                        width: "100%",
                        flexDirection: "row",
                        ...shadow.sm,
                    }}
                >
                    <TextInput
                        placeholder="Search Sessions..."
                        style={{
                            width: "100%",
                            flexShrink: 1,
                            paddingVertical: padding.sm,
                            paddingHorizontal: padding.md,
                            fontFamily: "Arimo-Regular",
                            color: colors.schemes.light.onSurface,
                            verticalAlign: "middle",
                            textAlignVertical: "center",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            borderWidth: 1,
                            borderRightWidth: 0,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderRadius: borderRadius.base,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            backgroundColor: "white",
                        }}
                    />
                    <InlineRadioButton
                        selectedValue={props.sessionsViewType}
                        onChange={(value: string) => props.setSessionsViewType(value as any)}
                        options={[
                            ["Calendar",
                                <CalendarIcon
                                    size={16}
                                    color={props.sessionsViewType === "Calendar" ? "black" : colors.schemes.light.onSurfaceVariant}
                                />
                            ],
                            ["List",
                                <TextAlignJustify
                                    size={16}
                                    color={props.sessionsViewType === "List" ? "black" : colors.schemes.light.onSurfaceVariant}
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
                    <Pressable
                        onPress={() => 1}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderLeftWidth: 0,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderStyle: "solid",
                            backgroundColor: colors.schemes.light.surfaceContainerLow,
                        }}
                    >
                        <ArrowUpDown
                            size={18}
                            color={colors.schemes.light.onSurfaceVariant}
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => 1}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderLeftWidth: 0,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderStyle: "solid",
                            backgroundColor: colors.schemes.light.surfaceContainer,
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8
                        }}
                    >
                        <Search
                            size={18}
                            color={colors.schemes.light.onSurfaceVariant}
                        />
                    </Pressable>
                </View>
                {props.sessionsViewType === "List" &&
                    <FunctionalDateLarge
                        openCalendar={() => props.functionalDate.setShowCalendar(true)}
                        dateStart={props.functionalDate.dateStart}
                        dateOffset={props.functionalDate.dateOffset}
                        setDateOffset={props.functionalDate.setDateOffset}
                        prevDay={props.functionalDate.prevDay}
                        nextDay={props.functionalDate.nextDay}
                    />
                }
                {props.sessionsViewType === "List" &&
                    <View
                        style={{
                            rowGap: padding.md,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end"
                            }}
                        >
                            
                        </View>
                        
                    </View>
                }
                {props.sessionsViewType === "Calendar" &&
                    <View
                        style={{
                            ...shadow.sm
                        }}
                    >
                        <Calendar
                            onDayPress={props.functionalDate.onDayPress}
                            markingType={"multi-dot"}
                            markedDates={props.multiDotMarkedDates}
                            style={{
                                overflow: "hidden",
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                borderRadius: borderRadius.base
                            }}
                            theme={{
                                calendarBackground: "white",
                                backgroundColor: "white",
                            }}
                        />
                    </View>
                }
            </View>
            <View
                    style={Object.assign({},
                        {
                            paddingHorizontal: margin.sm,
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 12,
                        },
                        props.sessionsViewType === "Calendar" && {
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            paddingVertical: margin["2xs"],

                        }
                    ) as any}
            >
                {props.sessionsViewType === "Calendar" &&
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <ThemedText
                            style={{
                                fontWeight: 500,
                                fontSize: fontSize.lg,
                                textAlign: "center",
                                color: colors.schemes.light.onBackground,
                            }}
                        >
                            {props.sessionsOnDateLabel}
                        </ThemedText>
                    </View>
                }
                {props.sessionsOnDate.map((session: any, i: number) => (
                    <Fragment key={i}>
                        <CardSession
                            {...session}
                        />
                    </Fragment>
                ))}
                {!props.sessionsOnDate.length &&
                    <View
                        style={{
                            width: "100%",
                            paddingHorizontal: 24,
                            paddingVertical: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            rowGap: padding.xs,
                            borderWidth: 1,
                            borderStyle: "dashed",
                            borderColor: colors.schemes.light.outlineVariant,
                            borderRadius: borderRadius.base,
                            backgroundColor: colors.schemes.light.surfaceContainer
                        }}
                    >
                        <TreePalm
                            size={36}
                            strokeWidth={1.5}
                            color={colors.schemes.light.onSurfaceVariant}
                            style={{
                                marginBottom: padding.sm
                            }}
                        />
                        <ThemedText
                                    style={{
                                        fontSize: fontSize.base,
                                        fontWeight: 500,
                                        letterSpacing: letterSpacing.lg,
                                        color: colors.schemes.light.onSurface,
                                        textAlign: "center"
                                    }}
                                >
                                    No Sessions
                                </ThemedText>
                                <ThemedText
                                    style={{
                                        maxWidth: 200,
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: colors.schemes.light.onSurfaceVariant,
                                        letterSpacing: letterSpacing.xl,
                                        textAlign: "center"
                                    }}
                                >
                                    There are no sessions scheduled for today.
                                </ThemedText>
                            </View>
                        }
                    </View>
                </View>
    )
}