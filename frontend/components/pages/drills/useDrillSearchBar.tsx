import useSearchBar, { Key } from "@/hooks/useSearchBar";
import { Drill } from "@/services/drills";
import { useEffect, useState } from "react";

export default function useDrillSearchBar(drills: Array<Drill>) {
    const feedOptions = [
        ["library", "My Library"],
        ["explore", "Explore"],
        ["bookmarked", "Bookmarks"]
    ];

    const [feed, setFeed] = useState("library");

    const searchKeyOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
    ];

    const sortKeysOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
        ["level", "Level"],
    ];

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState("name");
    
    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState("name");

    const [filtered, setFiltered] = useState<Array<Drill>>([]);
    const searchBar = useSearchBar<Drill>(drills, searchKey, sortKey);


    useEffect(() => {
        console.log('\n\n\n\nFILTERED')
        console.log(drills);
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, feed, drills);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, feed, drills]);


  const searchDrillsByFeed = (feed: any, drills: Array<Drill>) => {
    if (feed === 'explore')
        return [...drills];
    if (feed === 'library')
        return drills.filter((session) => session.publicDrill === false);
    if (feed === 'bookmarked')
        return drills.filter((drill) => drill.bookmarked === true);
    return [...drills];
    }


    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, feed: any, drills: Array<Drill>) => {
        return searchBar.sortObjects(
            sort,
            sortKey,
            searchDrillsByFeed(
                feed,
                searchBar.searchObjects(
                    search,
                    searchKey,
                    drills
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
        feed,
        setFeed,
        feedOptions,
        filtered,
        setFiltered,
        searchDrillsByFeed,
        searchAndSortDrills
    }
}
