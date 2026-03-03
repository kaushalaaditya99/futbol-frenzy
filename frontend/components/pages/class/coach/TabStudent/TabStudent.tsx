import SearchBar from "@/components/ui/SearchBar";
import ThemedText from "@/components/ui/ThemedText";
import useSearchBar from "@/hooks/useSearchBar";
import { Student } from "@/services/students"
import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { Fragment } from "react";
import { View } from "react-native";
import RowCardStudent from "./RowCardStudent";

interface TabStudentProps {
    searchBar: ReturnType<typeof useSearchBar<Student>>;
    students: Array<Student>;
}

export default function TabStudent(props: TabStudentProps) {
    return (
        <View
            style={{
                marginHorizontal: margin.sm,
                marginVertical: margin["2xs"],
                rowGap: padding.lg,
                backgroundColor: colors.schemes.light.background,
            }}
        >
            {/* <ThemedText
                style={{
                    fontWeight: 500,
                    fontSize: fontSize.lg,
                    letterSpacing: letterSpacing.xs,
                    color: colors.schemes.light.onBackground,
                }}
            >
                Students
            </ThemedText> */}
            <SearchBar
                search={props.searchBar.search}
                setSearch={props.searchBar.setSearch}
                enableSort={true}
                sortDirection={props.searchBar.sortDirection}
                setSortDirection={props.searchBar.setSortDirection}
            />
            {props.students.map((student: any, i: number) => (
                <Fragment key={i}>
                    <RowCardStudent
                        {...student}
                    />
                </Fragment>
            ))}
        </View>
    )
}