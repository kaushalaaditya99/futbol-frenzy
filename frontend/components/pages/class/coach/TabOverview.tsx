import { View } from "react-native";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import CardMetric from "@/components/pages/CardMetric";
import { Fragment } from "react";
import RowCardSession from "@/components/pages/home/RowCardSession";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import { Session } from "@/services/sessions";
import ButtonShare from "./ButtonShare";
import ButtonSettings from "./ButtonSettings";
import ThemedText from "@/components/ui/ThemedText";

interface TabOverviewProps {
    onSharePress: () => void;
    onSettingsPress: () => void;
    sessionsToday: Array<Session>;
}

export default function TabOverview(props: TabOverviewProps) {
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
                <ButtonShare
                    onPress={props.onSharePress}
                />
                <ButtonSettings
                    onPress={props.onSettingsPress}
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
                <CardMetric
                    key={"Number\nStudents"}
                    value="10"
                />
                <CardMetric
                    key={"Sessions\nToday"}
                    value="5"
                />
                <CardMetric
                    key={"Sessions\nUngraded"}
                    value="5"
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
                        rowGap: padding.lg
                    }}
                >
                    {props.sessionsToday.map((session: any, i: number) => (
                        <Fragment key={i}>
                            <RowCardSession
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