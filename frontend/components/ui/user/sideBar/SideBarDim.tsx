import { Dimensions, Pressable } from "react-native";

interface SideBarDimProps {
    setShowSideBar: (show: boolean) => void;
}

export default function SideBarDim(props: SideBarDimProps) {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
        <Pressable
            onPress={() => props.setShowSideBar(false)}
            style={{
                position: "absolute",
                zIndex: 100,
                height: height,
                minHeight: height,
                width: width,
                minWidth: width,
                backgroundColor: "#000000D0"
            }}
        />
    )
}