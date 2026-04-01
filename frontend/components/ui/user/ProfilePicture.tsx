import { colors } from "@/theme";
import { GestureResponderEvent, ImageBackground, Pressable, ViewStyle } from "react-native";


interface ProfilePictureProps {
    onClick?: () => void;
    width?: number;
    height?: number;
    imageStyle?: ViewStyle;
  height?: number;
  //use the following path to specify a path to the actual user image
    path?: string;
}

const DEFAULT_PATH = '../../../assets/images/Pedri-11.jpg';


export default function ProfilePicture(props: ProfilePictureProps) {
    const openSideBar = (e: GestureResponderEvent) => {
        e.stopPropagation();
        props.onClick && props.onClick();
    }
    const path = props.path ?? DEFAULT_PATH;
    return (
        <Pressable
            onPress={openSideBar}
            style={{
                position: "relative",
                alignSelf: "flex-start"
            }}
        >
        <ImageBackground
                //this following line would be modified to take the pfp path, i.e. source = {path}
                source= {require('../../../assets/images/Pedri-11.jpg')}
                style={{
                    width: props.width || 36,
                    height: props.height || 36,
                    overflow: "hidden",
                    borderRadius: 100,
                    backgroundColor: colors.schemes.light.surfaceContainerLowest,
                    ...props.imageStyle
                }}
            />
        </Pressable>
    )
}
