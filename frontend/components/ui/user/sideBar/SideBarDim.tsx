import { Pressable } from "react-native";

interface SideBarDimProps {
    setShowSideBar: (show: boolean) => void;
}

export default function SideBarDim(props: SideBarDimProps) {
    return (
        <Pressable
            onPress={() => props.setShowSideBar(false)}
            style={{
                position: "absolute",
                zIndex: 100,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#000000D0"
            }}
        />
    )
}