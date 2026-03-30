import { useAuth } from "@/contexts/AuthContext";
import useSearchBar, { Key } from "@/hooks/useSearchBar";
import { Drill as Drill } from "@/services/drills";
import { getUser, User } from "@/services/user";
import { useEffect, useState } from "react";

export type AccessControl = boolean | null;
export type Feed = "library" | "bookmark" | null;

export default function useDrillSearchBar(drills: Array<Drill>) {
    const { token } = useAuth();
    const [user, setUser] = useState<User>();

    const searchKeyOptions = [
        ["drillName", "Name"],
        [(drill: Drill) => `${drill.coach.first_name} ${drill.coach.last_name}`, "Uploaded By"],
    ];

    const sortKeysOptions = [
        ["drillName", "Name"],
        [(drill: Drill) => `${drill.coach.first_name} ${drill.coach.last_name}`, "Uploaded By"],
        ["difficultyLevel", "Level"],
    ];

    const accessControlOptions = [
        [null, "All"],
        [true, "Public"],
        [false, "Private"]
    ];

    const feedOptions = [
        ["library", "My Library"], 
        [null, "Explore"], 
        ["bookmark", "Bookmarks"]
    ];

    const [feed, setFeed] = useState<Feed>("library");

    const [sort, setSort] = useState<0|1|2>(0);
    const [sortKey, setSortKey] = useState("drillName");

    const [search, setSearch] = useState("");
    const [searchKey, setSearchKey] = useState("drillName");
    
    const [accessControl, setAccessControl] = useState<AccessControl>(null);
    
    const [filtered, setFiltered] = useState<Array<Drill>>([]);
    const searchBar = useSearchBar<Drill>(drills, searchKey, sortKey);


    useEffect(() => {
        const load = async () => {
            if (!token)
                return;
            const user = await getUser(token);
            setUser(user[0]);
        }
        load();
    }, [token]);

    
    useEffect(() => {
        console.log(feed)
        const fDrills = searchAndSortDrills(search, searchKey, sort, sortKey, accessControl, feed, drills);
        setFiltered(fDrills);
    }, [search, searchKey, sort, sortKey, accessControl, feed, drills]);



    const searchDrillsByAccessControl = (accessControl: AccessControl, drills: Array<Drill>) => {
        if (accessControl === null)
            return [...drills];
        const fDrills = drills.filter((drill) => drill.publicDrill === accessControl);
        return fDrills;
    }


    const searchDrillsByFeed = (feed: Feed, drills: Array<Drill>) => {
        if (feed === null)
            return [...drills];

        let fDrills = [...drills];

        if (feed === "bookmark")
            fDrills = fDrills.filter((drill) => drill.bookmarked === true);
        else if (feed === "library" && user)
            fDrills = fDrills.filter((drill) => drill.coachID === user.id);
        
        return fDrills;
    }


    const searchAndSortDrills = (search: string, searchKey: Key, sort: 0|1|2, sortKey: Key, accessControl: AccessControl, feed: Feed, drills: Array<Drill>) => {
        return searchBar.sortObjects(
            sort, 
            sortKey, 
            searchDrillsByFeed(
                feed,
                searchDrillsByAccessControl(
                    accessControl,
                    searchBar.searchObjects(
                        search, 
                        searchKey, 
                        drills
                    )
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
        searchAndSortDrills,
        feed,
        feedOptions,
        setFeed
    }
}