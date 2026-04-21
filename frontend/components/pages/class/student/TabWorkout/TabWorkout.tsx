import useFunctionalDate from "@/hooks/useFunctionalDate";
import { Session } from "@/services/sessions";
import { borderRadius, colors, fontSize, margin, padding, shadow } from "@/theme";
import { View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import SessionSearchBar from "../../coach/TabWorkout/SearchBar";
import Calendar from "@/components/ui/calendar/Calendar";
import SmallCalendar from "../../coach/TabWorkout/SmallCalendar";
import { MarkedDates } from "react-native-calendars/src/types";
import { Fragment } from "react";
import RowCardSession from "@/components/pages/home/RowCardSession";
import useSearchBar from "@/hooks/useSearchBar";
import NoSessions from "../../NoSessions";

interface StudentTabWorkoutProps {
    searchBar: ReturnType<typeof useSearchBar<Session>>;
    viewType: string;
    setViewType: (viewType: string) => void;
    sessionsOnDate: Array<Session>;
    sessionsOnDateLabel: string;
    functionalDate: ReturnType<typeof useFunctionalDate>;
    markedDatesAndSessions: MarkedDates;
}

export default function StudentTabWorkout(props: StudentTabWorkoutProps) {
    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingBottom: props.viewType === "Small" ? 0 : undefined,
                    paddingHorizontal: margin.sm,
                    rowGap: padding.lg,
                }}
            >
                <SessionSearchBar
                    search={props.searchBar.search}
                    setSearch={props.searchBar.setSearch}
                    enableSort={true}
                    sortDirection={props.searchBar.sortDirection}
                    setSortDirection={props.searchBar.setSortDirection}
                    placeholder="Search Assignments..."
                    viewType={props.viewType}
                    setViewType={props.setViewType}
                />
                {props.viewType === "Big" && (
                    <View style={{ ...shadow.sm }}>
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
                                calendarBackground: "white",
                            }}
                        />
                    </View>
                )}
                {props.viewType === "Small" && (
                    <SmallCalendar functionalDate={props.functionalDate} />
                )}
            </View>
            <View
                style={
                    Object.assign(
                        {},
                        {
                            marginTop: padding.lg,
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
                    ) as any
                }
            >
                {props.viewType === "Big" && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ThemedText
                            style={{
                                fontWeight: "500",
                                fontSize: fontSize.lg,
                                textAlign: "center",
                                color: colors.schemes.light.onBackground,
                            }}
                        >
                            {props.sessionsOnDateLabel}
                        </ThemedText>
                    </View>
                )}
                {props.sessionsOnDate.map((session: any, i: number) => (
                    <Fragment key={i}>
                        <RowCardSession {...session} showTag={true} />
                    </Fragment>
                ))}
                {!props.sessionsOnDate.length && <NoSessions />}
            </View>
        </View>
    );
}
