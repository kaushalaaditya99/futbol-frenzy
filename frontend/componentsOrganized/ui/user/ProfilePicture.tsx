import { colors } from "@/theme";
import { GestureResponderEvent, ImageBackground, Pressable } from "react-native";

interface ProfilePictureProps {
    openSideBar?: () => void;
    width?: number;
    height?: number;
}

export default function ProfilePicture(props: ProfilePictureProps) {
    const openSideBar = (e: GestureResponderEvent) => {
        e.stopPropagation();
        props.openSideBar && props.openSideBar();
    }

    return (
        <Pressable
            onPress={openSideBar}
            style={{
                position: "relative",
                alignSelf: "flex-start"
            }}
        >
            <ImageBackground
                source={require('../assets/images/Pedri-11.jpg')}
                style={{
                    width: props.width || 36,
                    height: props.height || 36,
                    overflow: "hidden",
                    borderRadius: 100,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                }}
            />
        </Pressable>
    )
}