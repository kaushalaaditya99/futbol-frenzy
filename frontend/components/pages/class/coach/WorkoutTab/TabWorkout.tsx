import useFunctionalDate from "@/hooks/useFunctionalDate";
import { Session } from "@/services/sessions";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { View } from "react-native";
import ButtonAssignSession from "../ButtonAssignSession";
import ButtonCreateSession from "../ButtonCreateSession";
import ThemedText from "@/components/ui/ThemedText";
import SessionSearchBar from "./SearchBar";
import Calendar from "@/components/ui/calendar/Calendar";
import SmallCalendar from "./SmallCalendar";
import { MarkedDates } from "react-native-calendars/src/types";
import { Fragment } from "react";
import RowCardSession from "@/components/pages/home/RowCardSession";
import { TreePalm } from "lucide-react-native";

interface TabWorkoutProps {
    onAssignPress: () => void;
    onCreatePress: () => void;
    search: string;
    setSearch: (search: string) => void;
    viewType: string;
    setViewType: (viewType: string) => void;
    sessionsOnDate: Array<Session>;
    sessionsOnDateLabel: string;
    functionalDate: ReturnType<typeof useFunctionalDate>;
    markedDatesAndSessions: MarkedDates;
}

export default function TabWorkout(props: TabWorkoutProps) {
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
                <ButtonAssignSession
                    onPress={props.onAssignPress}
                />
                <ButtonCreateSession
                    onPress={props.onCreatePress}
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingBottom: props.viewType === "List" ? 0 : undefined,
                    paddingHorizontal: margin.sm,
                    rowGap: padding.lg,
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
                <SessionSearchBar
                    search={props.search}
                    setSearch={props.setSearch}
                    placeholder="Search Sessions..."
                    viewType={props.viewType}
                    setViewType={props.setViewType}
                />
                {props.viewType === "Big" &&
                    <View
                        style={{...shadow.sm}}
                    >
                        <Calendar
                            markingType={"multi-dot"}
                            markedDates={props.markedDatesAndSessions}
                            onDayPress={props.functionalDate.onDayPress}
                            style={{
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor: colors.schemes.light.outlineVariant,
                                borderRadius: borderRadius.base,
                                backgroundColor: "white",
                            }}
                            theme={{
                                backgroundColor: "white",
                                calendarBackground: "white"
                            }}
                        />
                    </View>
                }
                {props.viewType === "Small" &&
                    <SmallCalendar
                        functionalDate={props.functionalDate}
                    />
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
                    props.viewType === "Big" && {
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                        paddingVertical: margin["2xs"],

                    }
                ) as any}
            >
                {props.viewType === "Big" &&
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
                        <RowCardSession
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