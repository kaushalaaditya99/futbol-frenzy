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
        ["uploadedByName", "Uploaded By"]
    ];

    const feedOptions = [
        ["library", "My Library"],
        ["explore", "Explore"],
        ["bookmarked", "Bookmarked"]
    ];

    const accessControlOptions = [
        ["public", "Public"],
        ["private", "Private"]
    ];

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState("name");

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState("name");
    
    const [feed, setFeed] = useState("explore");
    
    const [filtered, setFiltered] = useState<Array<Session>>([]);
    const searchBar = useSearchBar<Session>(sessions, searchKey, sortKey);


    useEffect(() => {
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, feed, sessions);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, feed, sessions]);

    const searchDrillsByFeed = (feed: any, workouts: Array<Session>) => {
        if (feed === 'library') {
            const fDrills = workouts.filter((session) => session.publicWorkout === false);
            return fDrills;
        }
        else if (feed === 'bookmarked') {
            const fDrills = workouts.filter((session) => session.bookmarked === true);
            return fDrills;
        }
        else {
            return [...workouts];
        }
    }


    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, feed: any, sessions: Array<Session>) => {
        return searchBar.sortObjects(
            sort, 
            sortKey, 
            searchDrillsByFeed(
                feed,
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
        sort,
        setSort,
        search,
        setSearch,
        searchKey,
        setSearchKey,
        sortKey,
        setSortKey,
        getNextDirection: searchBar.getNextDirection,
        filtered,
        setFiltered,
        searchAndSortDrills,
        feed,
        setFeed,
        feedOptions
    }
}