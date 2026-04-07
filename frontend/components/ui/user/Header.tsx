import { colors, margin, padding } from "@/theme";
import { View } from "react-native";
import ProfilePicture from "./ProfilePicture";
import Logo from "../Logo";


interface HeaderProps {
    openSideBar: () => void;
}

export default function Header(props: HeaderProps) {
    return (
        <View
            style={{
                paddingVertical: padding.xl,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: colors.schemes.light.outlineVariant,
                backgroundColor: colors.schemes.light.surface,
            }}
        >
            <View
                style={{
                    width: "33%",
                    paddingHorizontal: margin.sm
                }}
            >
                <ProfilePicture
                    onClick={props.openSideBar}
                />
            </View>
            <View
                style={{
                    width: "33%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Logo/>
            </View>
        </View>
    )
}