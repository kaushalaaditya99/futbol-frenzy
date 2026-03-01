import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function useSideBar() {
    const [showSideBar, setShowSideBar] = useState(false);
    const width = useSharedValue(0);
    const animatedExpandFromLeft = useAnimatedStyle(() => ({
        minWidth: width.value,
    }));

    const sideBarTargetWidth = Dimensions.get("window").width * 0.75; 
    
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

    return {
        showSideBar,
        setShowSideBar,
        width,
        sideBarTargetWidth,
        animatedExpandFromLeft
    }
}