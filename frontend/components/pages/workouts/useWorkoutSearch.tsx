import useSearchBar, { Key } from "@/hooks/useSearchBar";
import { Session } from "@/services/sessions";
import { useEffect, useState } from "react";

export type AccessControl = "public" | "private";

export default function useWorkoutSearch(sessions: Array<Session>) {
    const searchKeyOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
    ];

    const sortKeysOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
        // ["level", "Level"],
    ];

    const accessControlOptions = [
        ["public", "Public"],
        ["private", "Private"]
    ];

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState("name");

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState("name");
    
    const [accessControl, setAccessControl] = useState<AccessControl>("public");
    
    const [filtered, setFiltered] = useState<Array<Session>>([]);
    const searchBar = useSearchBar<Session>(sessions, searchKey, sortKey);


    useEffect(() => {
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, accessControl, sessions);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, accessControl, sessions]);


    const searchDrillsByAccessControl = (accessControl: AccessControl, drills: Array<Session>) => {
        const fDrills = drills.filter((session) => session.accessControl === accessControl);
        return fDrills;
    }


    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, accessControl: AccessControl, sessions: Array<Session>) => {
        return searchBar.sortObjects(
            sort, 
            sortKey, 
            searchDrillsByAccessControl(
                accessControl,
                searchBar.searchObjects(
                    search, 
                    searchKey, 
                    sessions
                )
            )
        );
    }

    return {
        searchKeyOptions,
        sortKeysOptions,
        accessControlOptions,
        sort,
        setSort,
        search,
        setSearch,
        searchKey,
        setSearchKey,
        sortKey,
        setSortKey,
        getNextDirection: searchBar.getNextDirection,
        accessControl,
        setAccessControl,
        filtered,
        setFiltered,
        searchDrillsByAccessControl,
        searchAndSortDrills
    }
}