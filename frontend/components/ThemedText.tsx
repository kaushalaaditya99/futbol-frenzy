import { ReactNode, useEffect } from "react";
import { Text, type TextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Inter_400Regular, Inter_700Bold, Inter_500Medium, Inter_600SemiBold, Inter_900Black } from '@expo-google-fonts/inter';


export default function ThemedText(props: {
    children?: ReactNode; 
    style?: StyleProp<TextStyle>; 
}) {
    const flatStyle = StyleSheet.flatten(props.style);
    const [fontsLoaded] = useFonts({
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_900Black
    });
  
    if (!fontsLoaded)
        return null;

    return (
        <Text
            style={{
                fontFamily: flatStyle?.fontWeight === 400 ? "Inter_400Regular" : flatStyle?.fontWeight === 500 ? "Inter_500Medium" : flatStyle?.fontWeight === 600 ? "Inter_600SemiBold" : flatStyle?.fontWeight === 700 ? "Inter_700Bold" : flatStyle?.fontWeight === 900 ? "Inter_900Black" : "Inter_400Regular",
                ...flatStyle,
            }}
        >
            {props.children}
        </Text>
    )
}