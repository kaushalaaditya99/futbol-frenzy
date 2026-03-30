import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter";
import { Lato_400Regular, Lato_700Bold, Lato_900Black, useFonts } from "@expo-google-fonts/lato";

export default function useLocalFonts() {
    const [fontsLoaded] = useFonts({
        // Lato
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        // Inter
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_900Black,
        // Doto
        "Doto-Regular": require("@/assets/fonts/Doto/Doto-Regular.ttf"),
        "Doto-Medium": require("@/assets/fonts/Doto/Doto-Medium.ttf"),
        "Doto-Bold": require("@/assets/fonts/Doto/Doto-Bold.ttf"),
        "Doto-SemiBold": require("@/assets/fonts/Doto/Doto-SemiBold.ttf"),
        "Doto-ExtraBold": require("@/assets/fonts/Doto/Doto-ExtraBold.ttf"),
        "Doto-Black": require("@/assets/fonts/Doto/Doto-Black.ttf"),
        // Arimo
        "Arimo-Regular": require("@/assets/fonts/Arimo/Arimo-Regular.ttf"),
        "Arimo-Medium": require("@/assets/fonts/Arimo/Arimo-Medium.ttf"),
        "Arimo-SemiBold": require("@/assets/fonts/Arimo/Arimo-SemiBold.ttf"),
        "Arimo-Bold": require("@/assets/fonts/Arimo/Arimo-Bold.ttf"),
        // Silkscreen
        "Silkscreen-Bold": require("@/assets/fonts/Silkscreen/Silkscreen-Bold.ttf"),
        "Silkscreen-Regular": require("@/assets/fonts/Silkscreen/Silkscreen-Regular.ttf"    ) 
    });
      
    const fonts = {
        "Arimo": {
            400: "Arimo-Regular",
            500: "Arimo-Medium",
            600: "Arimo-SemiBold",
            700: "Arimo-Bold",
            800: "Arimo-Bold",
            900: "Arimo-Bold"
        },
        "Inter": {
            400: "Inter_400Regular",
            500: "Inter_500Medium",
            600: "Inter_600SemiBold",
            700: "Inter_700Bold",
            800: "Inter_700Bold",
            900: "Inter_900Black"
        },
        "Silkscreen": {
            400: "Silkscreen-Regular",
            500: "Silkscreen-Bold",
            600: "Silkscreen-Bold",
            700: "Silkscreen-Bold",
            800: "Silkscreen-Bold",
            900: "Silkscreen-Bold"
        }
    }

    return {
        fontsLoaded,
        fonts
    }
}