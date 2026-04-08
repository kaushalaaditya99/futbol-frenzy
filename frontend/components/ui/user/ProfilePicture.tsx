import { colors } from "@/theme";
import { GestureResponderEvent, Image, Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { useProfile } from "@/contexts/ProfileContext";

interface ProfilePictureProps {
    onClick?: () => void;
    width?: number;
    height?: number;
}

export default function ProfilePicture(props: ProfilePictureProps) {
    const { profile } = useProfile();
    const size = props.width || 36;

    const openSideBar = (e: GestureResponderEvent) => {
        e.stopPropagation();
        props.onClick && props.onClick();
    };

    const hasImage = profile.pfp && profile.pfp !== "" && profile.pfp !== "somefile.png";
    const initials = `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase();

    return (
        <Pressable
            onPress={openSideBar}
            style={{
                position: "relative",
                alignSelf: "flex-start",
            }}
        >
            {hasImage ? (
                <Image
                    source={{ uri: profile.pfp }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: colors.schemes.light.surfaceContainerHigh,
                    }}
                />
            ) : (
                <View
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: colors.schemes.light.surfaceContainerHigh,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: size * 0.4,
                            fontWeight: "700",
                            color: colors.schemes.light.onSurfaceVariant,
                        }}
                    >
                        {initials || "?"}
                    </ThemedText>
                </View>
            )}
        </Pressable>
    );
}
