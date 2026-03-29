import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function useSideBar() {
    const width = useSharedValue(0);
    const sideBarTargetWidth = Dimensions.get("window").width * 0.75; 
    const [showSideBar, setShowSideBar] = useState(false);
    const animatedExpandFromLeft = useAnimatedStyle(() => ({
        minWidth: width.value,
    }));
    

    useEffect(() => {
        width.value = withTiming(showSideBar ? sideBarTargetWidth : 0, {duration: 300});
    }, [showSideBar]);


    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowSideBar(false);
            };
        }, [])
    );


    const openSideBar = () => {
        setShowSideBar(true);
    }


    const closeSideBar = () => {
        setShowSideBar(false);
    }
    

    return {
        showSideBar,
        setShowSideBar,
        openSideBar,
        closeSideBar,
        width,
        sideBarTargetWidth,
        animatedExpandFromLeft
    }
}