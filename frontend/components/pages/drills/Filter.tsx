import { View } from "react-native";
import useDrillSearchBar from "./useDrillSearchBar"
import SearchBar from "@/components/ui/SearchBar";
import InputDropdownV2 from "../../ui/input/InputDropdownV2";
import SearchBarSort from "@/components/ui/SearchBarSort";
import InlineRadioGroup from "@/components/ui/input/InlineRadioGroup";
import { useState } from "react";
import { padding, theme } from "@/theme";
import { LayoutGrid, List, StretchHorizontal } from "lucide-react-native";

interface FilterProps {
    viewType: string;
    setViewType: (type: string) => void;
    drillSearchBar: ReturnType<typeof useDrillSearchBar>;
}

export default function Filter(props: FilterProps) {
    return (
        <View
            style={{
                rowGap: padding.md
            }}
        >
            <View>
                <SearchBar
                    search={props.drillSearchBar.search}
                    setSearch={props.drillSearchBar.setSearch}
                    enableSort={false}
                    containerStyle={{
                        height: 36,
                    }}
                    childrenLeftOfSort={
                        <InputDropdownV2
                            value={props.drillSearchBar.searchKey}
                            onChange={props.drillSearchBar.setSearchKey}
                            options={props.drillSearchBar.searchKeyOptions as [string, string][]}
                            buttonStyle={{
                                height: "100%",
                                borderRadius: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
                                borderBottomWidth: 0
                            }}
                        />
                    }
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    columnGap: theme.padding.md
                }}
            >
                <View
                    style={{
                        height: 36,
                        flex: 1,
                        flexDirection: "row"
                    }}
                >
                    <InputDropdownV2
                        value={props.drillSearchBar.sortKey}
                        onChange={props.drillSearchBar.setSortKey}
                        options={props.drillSearchBar.sortKeysOptions as [string, string][]}
                        containerStyle={{
                            flex: 1,
                        }}
                        buttonStyle={{
                            height: "100%",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRightWidth: 0,
                        }}
                        labelPrefix="Sort by "
                    />
                    <SearchBarSort
                        sortDirection={props.drillSearchBar.sort}
                        updateSortDirection={(direction: number) => props.drillSearchBar.setSort(props.drillSearchBar.getNextDirection(direction))}
                        sortButtonStyle={{
                            borderWidth: 1,
                            borderRightWidth: 1,
                            borderTopRightRadius: theme.borderRadius.base,
                            borderBottomRightRadius: theme.borderRadius.base,
                            ...theme.shadow.sm
                        }}
                    />
                </View>
                <View>
                    <InputDropdownV2
                        value={props.drillSearchBar.accessControl}
                        onChange={(value: string) => props.drillSearchBar.setAccessControl(value as any)}
                        options={props.drillSearchBar.accessControlOptions as [string, string][]}
                        buttonStyle={{
                            height: 36
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <InlineRadioGroup
                        value={props.viewType}
                        onChange={props.setViewType}
                        options={[
                            [
                                "grid",
                                <LayoutGrid
                                    size={16}
                                    color={props.viewType === "grid" ? "black" : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            ],
                            [
                                "list",
                                <StretchHorizontal
                                    size={16}
                                    color={props.viewType === "list" ? "black" : theme.colors.schemes.light.onSurfaceVariant}
                                />
                            ]
                        ]}
                        containerStyle={{
                            height: "100%",
                        }}
                        optionStyle={{
                            paddingVertical: theme.padding.sm,
                            paddingHorizontal: theme.padding.md,
                            display: "flex",
                            flex: undefined,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 0
                        }}
                        selectedOptionStyle={{
                            borderRadius: 6
                        }}
                    />
                </View>
            </View>
        </View>
    )
}