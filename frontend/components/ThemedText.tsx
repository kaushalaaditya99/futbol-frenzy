import { ReactNode } from "react";
import { Text, TextStyle } from 'react-native';
import useLocalFonts from "@/hooks/useFonts";

interface ThemedTextProps {
    children?: ReactNode;
    style?: TextStyle; 
    fontFamily?: "Arimo"|"Inter";
    numberLines?: number;
}

export default function ThemedText(props: ThemedTextProps) {
    const fonts = useLocalFonts();

    if (!fonts.fontsLoaded)
        return null;

    return (
        <Text
            numberOfLines={props.numberLines}
            style={{
                fontFamily: fonts.fonts[props.fontFamily || "Arimo"][(props.style?.fontWeight as 400|500|600|700|800|900) || 400],
                ...props.style,
            }}
        >
            {props.children}
        </Text>
    )
}