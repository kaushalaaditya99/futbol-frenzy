import { View } from "react-native";
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import CardMetric from "@/components/pages/CardMetric";
import { Fragment } from "react";
import RowCardSession from "@/components/pages/home/RowCardSession";
import ViewAllButton from "@/components/pages/home/ViewAllButton";
import { Session } from "@/services/sessions";
import { Student } from "@/services/students";
import ButtonShare from "../ButtonShare";
import ButtonSettings from "../ButtonSettings";
import ThemedText from "@/components/ui/ThemedText";
import NoSessions from "../../NoSessions";
import ShareClass from "./ShareClass";
import Settings from "./Settings";

interface TabOverviewProps {
    showShareClass: boolean;
    showSettings: boolean;
    setShowSettings: (settings: boolean) => void;
    setShowShareClass: (shareClass: boolean) => void;
    sessionsToday: Array<Session>;
    students: Array<Student>;
    className?: string;
    classCode?: string;
}

export default function TabOverview(props: TabOverviewProps) {
    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background
            }}
        >
            {props.showSettings &&
                <Settings
                    onClose={() => props.setShowSettings(false)}
                    className={props.className}
                    classCode={props.classCode}
                    students={props.students}
                />
            }
            {props.showShareClass &&
                <ShareClass
                    onClose={() => props.setShowShareClass(false)}
                />
            }
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
                    onPress={() => props.setShowShareClass(true)}
                />
                <ButtonSettings
                    onPress={() => props.setShowSettings(true)}
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
                    label={"Students\nIn Class"}
                    value="10"
                />
                <CardMetric
                    label={props.sessionsToday.length === 1 ? "Session\nToday" : "Sessions\nToday"}
                    value={""+props.sessionsToday.length}
                />
                <CardMetric
                    label={"Sessions\nUngraded"}
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
                    {!props.sessionsToday.length &&
                        <NoSessions/>
                    }
                </View>
            </View>
        </View>
    )
}