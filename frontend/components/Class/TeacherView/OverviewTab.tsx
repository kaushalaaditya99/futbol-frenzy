import { View } from "react-native";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import CreateSessionFastButton from "./CreateSessionFastButton";
import ShareButton from "./ShareButton";
import SettingsButton from "./SettingsButton";
import CardSummary from "@/components/Home/CardSummary";
import ThemedText from "@/components/ThemedText";
import { Fragment } from "react";
import CardSession from "@/components/Home/CardSession";
import ViewAllButton from "@/components/Home/ViewAll";
import { Session } from "@/services/sessions";

interface OverviewTabProps {
    sessionsToday: Array<Session>;
}

export default function OverviewTab(props: OverviewTabProps) {
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
                <CreateSessionFastButton
                    onPress={() => 1}
                />
                <ShareButton
                    onPress={() => 1}
                />
                <SettingsButton
                    onPress={() => 1}
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
                    paddingHorizontal: margin.sm,
                    flexDirection: "row",
                    columnGap: padding.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.schemes.light.outlineVariant
                }}
            >
                <CardSummary
                    k={"Number\nStudents"}
                    v2="10"
                />
                <CardSummary
                    k={"Sessions\nToday"}
                    v2="5"
                />
                <CardSummary
                    k={"Sessions\nUngraded"}
                    v2="5"
                />
            </View>
            <View
                style={{
                    paddingVertical: margin.sm,
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
                                    Today's Scheduled Sessions
                                </ThemedText>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 12
                                    }}
                                >
                                    {props.sessionsToday.map((session: any, i: number) => (
                                        <Fragment key={i}>
                                            <CardSession
                                                {...session}
                                                showTag={false}
                                            />
                                        </Fragment>
                                    ))}
                                    <ViewAllButton/>
                                </View>
                            </View>
                        </View>
    )
}