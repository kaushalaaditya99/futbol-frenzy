import { useEffect, useState } from "react";

export type Key = string | ((object: any) => string);

export default function useSearchBar<Object>(objects: Array<Object>, searchKey: Key, sortKey: Key) {
    const [sort, setSort] = useState<0|1|2>(0);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<Array<Object>>([]);
    

    useEffect(() => {
        // console.log('search', search);
        // console.log('searchKey', searchKey);
        // console.log('sort', sort);
        // console.log('sortKey', sortKey);
        const fObjects = searchAndSortObjects(search, searchKey, sort, sortKey, objects);
        setFiltered(fObjects);
    }, [search, searchKey, sort, sortKey, objects]);


    const getNextDirection = (direction: number) => {
        const nextDirection = (direction + 1) % 3 as 0|1|2;
        return nextDirection;
    }


    const getSearchSortValue = (object: any, key: Key): string => {
        if (typeof key === "string")
            return (object as any)[key];
        return key(object);
    }


    const searchObjects = (search: string, searchKey: Key, objects: Array<Object>) => {
        const searchLowerCase = search ? search.toLowerCase() : '';
        const fObjects = objects.filter((object) => {
            const objectSearchKeyLower = (getSearchSortValue(object as any, searchKey) || '').toLowerCase();
            const match = objectSearchKeyLower.includes(searchLowerCase);
            return match;
        });
        return fObjects;
    }

    const sortObjects = (sortDirection: 0|1|2, sortKey: Key, objects: Array<Object>) => {
        if (sortDirection === 0)
            return [...objects];

        const fObjects = [...objects];

        fObjects.sort((a, b) => {
            const aValue = getSearchSortValue(a as any, sortKey);
            const bValue = getSearchSortValue(b as any, sortKey);

            if (sortDirection === 1)
                return aValue.localeCompare(bValue);
            return bValue.localeCompare(aValue);
        });

        return fObjects;
    }


    const searchAndSortObjects = (search: string, searchKey: Key, sortDirection: 0|1|2, sortKey: Key, objects: Array<Object>) => {
        return sortObjects(sortDirection, sortKey, searchObjects(search, searchKey, objects));
    }


    return {
        search,
        setSearch,
        sortDirection: sort,
        setSortDirection: setSort,
        filtered,
        setFiltered,
        searchAndSortObjects,
        searchObjects,
        sortObjects,
        getNextDirection
    }
}