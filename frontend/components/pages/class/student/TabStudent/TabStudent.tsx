import SearchBar from "@/components/ui/SearchBar";
import useSearchBar from "@/hooks/useSearchBar";
import { Student } from "@/services/students";
import { colors, margin, padding } from "@/theme";
import { Fragment } from "react";
import { View } from "react-native";
import RowCardStudent from "../../coach/TabStudent/RowCardStudent";

interface StudentTabStudentProps {
    searchBar: ReturnType<typeof useSearchBar<Student>>;
    students: Array<Student>;
}

export default function StudentTabStudent(props: StudentTabStudentProps) {
    return (
        <View
            style={{
                marginHorizontal: margin["2xs"],
                marginVertical: margin["2xs"],
                rowGap: padding.lg,
                backgroundColor: colors.schemes.light.background,
            }}
        >
            <SearchBar
                search={props.searchBar.search}
                setSearch={props.searchBar.setSearch}
                enableSort={true}
                sortDirection={props.searchBar.sortDirection}
                setSortDirection={props.searchBar.setSortDirection}
            />
            {props.students.map((student: any, i: number) => (
                <Fragment key={i}>
                    <RowCardStudent {...student} />
                </Fragment>
            ))}
        </View>
    );
}
