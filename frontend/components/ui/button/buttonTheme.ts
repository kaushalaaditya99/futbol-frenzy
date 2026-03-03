import { colors } from "@/theme";

interface Theme {
    tintColor: string;
    tintUpsideDown: boolean;
    borderColor: string;
    backgroundColor: string;
}

export const buttonTheme: {[k: string]: Theme} = {
    "blue": {
        tintColor: "#FFFFFF5A",
        tintUpsideDown: false,
        borderColor: "#2989FF",
        backgroundColor: "#2989FF"
    },
    "black": {
        tintColor: "#646464f0",
        tintUpsideDown: false,
        borderColor: "black",
        backgroundColor: "black"
    },
    "white": {
        tintColor: "white",
        tintUpsideDown: true,
        borderColor: colors.schemes.light.outlineVariant,
        backgroundColor: "white"
    },
    "disabled": {
        tintColor: "#ffffffad",
        tintUpsideDown: false,
        borderColor: "gray",
        backgroundColor: "gray"
    }
}