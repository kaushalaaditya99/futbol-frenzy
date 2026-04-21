import useSearchBar, { Key } from "@/hooks/useSearchBar";
import { Submission } from "@/services/assignments";
import { useEffect, useState } from "react";

export type Grade = "all" | "ungraded" | "graded";
export type Submit = "all" | "submitted" | "notSubmitted";

export default function useSubmissionSearch(submissions: Array<Submission>) {
    const searchKeyOptions = [
        ['name', "Name"],
    ];

    const sortKeysOptions = [
        ['name', "Name"],
        ['grade', "Grade"],
    ];

    const gradeOptions = [
        ["all", "All Grades"],
        ["ungraded", "Graded"],
        ["graded", "Ungraded"]
    ];

    const submittedOptions = [
        ["all", "All Submissions"],
        ["submitted", "Submitted"],
        ["notSubmitted", "Not Submitted"]
    ];

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState('name');

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState('name');
    
    const [grade, setGrade] = useState<Grade>("all");
    const [submit, setSubmit] = useState<Submit>("all");
    
    const [filtered, setFiltered] = useState<Array<Submission>>([]);
    const searchBar = useSearchBar<Submission>(submissions, searchKey, sortKey);


    useEffect(() => {
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, grade, submissions);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, grade, submit, submissions]);


    const searchSubmissionsByGrade = (grade: Grade, submissions: Array<Submission>) => {
        if (grade === 'all')
            return [...submissions];
        const fSubmissions = submissions.filter((submission) => (grade === 'graded' && submission.dateGraded) || (grade === 'ungraded' && !submission.dateGraded));
        return fSubmissions;
    }

    const searchSubmissionsBySubmit = (submit: Submit, submissions: Array<Submission>) => {
        if (submit === 'all')
            return [...submissions];
        const fSubmissions = submissions.filter((submission) => (submit === 'submitted' && submission.dateSubmitted) || (submit === 'notSubmitted' && !submission.dateSubmitted));
        return fSubmissions;
    }

    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, grade: Grade, submissions: Array<Submission>) => {
        console.log('search', search);
        console.log('searchKey', searchKey);

        return searchBar.sortObjects(
            sort, 
            sortKey === 'name' ? (submission: Submission) => `${submission.student.first_name} ${submission.student.last_name}` : sortKey === 'grade' ? (submission: Submission) => `${submission.grade}` : '', 
            searchSubmissionsBySubmit(
                submit,
                searchSubmissionsByGrade(
                    grade,
                    searchBar.searchObjects(
                        search, 
                        searchKey === 'name' ? (submission: Submission) => `${submission.student.first_name} ${submission.student.last_name}` : '', 
                        submissions
                    )
                )
            )
        );
    }

    return {
        searchKeyOptions,
        sortKeysOptions,
        gradeOptions,
        sort,
        setSort,
        search,
        setSearch,
        searchKey,
        setSearchKey,
        sortKey,
        setSortKey,
        getNextDirection: searchBar.getNextDirection,
        grade,
        gradeLabel: (grade: string) => gradeOptions[gradeOptions.findIndex(g => g[0] === grade)][1],
        setGrade,
        submit,
        submitLabel: (submit: string) => submittedOptions[submittedOptions.findIndex(g => g[0] === grade)][1],
        setSubmit,
        submittedOptions,
        filtered,
        setFiltered,
        searchSubmissionsByGrade,
        searchAndSortDrills
    }
}