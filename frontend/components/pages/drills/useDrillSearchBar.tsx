import useSearchBar, { Key } from "@/hooks/useSearchBar";
import { Drill } from "@/services/drills";
import { useEffect, useState } from "react";

export type AccessControl = "public" | "private";

export default function useDrillSearchBar(drills: Array<Drill>) {
    const searchKeyOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
    ];

    const sortKeysOptions = [
        ["name", "Name"],
        ["uploadedByName", "Uploaded By"],
        ["level", "Level"],
    ];

    const accessControlOptions = [
        ["public", "Public"],
        ["private", "Private"]
    ];

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState("name");
    const [isPublic, setIsPublic] = useState(false);

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState("name");

    const [accessControl, setAccessControl] = useState<AccessControl>("public");

    const [filtered, setFiltered] = useState<Array<Drill>>([]);
    const searchBar = useSearchBar<Drill>(drills, searchKey, sortKey);


    useEffect(() => {
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, accessControl, drills);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, accessControl, drills]);


  const searchDrillsByAccessControl = (accessControl: AccessControl, drills: Array<Drill>) => {
    //absolutely disgusting logic to set IsPublic and match with accessControl
    if (accessControl == 'private')
      setIsPublic(false);
    else if (accessControl == 'public')
      setIsPublic(true)

    const fDrills = drills.filter((drill) => drill.publicDrill === isPublic);
        return fDrills;
    }


    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, accessControl: AccessControl, drills: Array<Drill>) => {
        return searchBar.sortObjects(
            sort,
            sortKey,
            searchDrillsByAccessControl(
                accessControl,
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
