import { colors } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import { Session } from "@/services/sessions";
import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";

interface RowCardSessionProps extends Session {
    showTag?: boolean;
    onPress?: () => void;
}

export default function RowCardSession(props: RowCardSessionProps) {
    const handlePress = props.onPress ?? (() => {
        router.push(`/assignments/${props.id}`);
    });

    // Determine tag colors based on state
    const getTagStyle = () => {
        if (props["isCompleted"]) {
            return {
                backgroundColor: colors.palettes.tertiary[90],
                color: colors.palettes.tertiary[50]
            };
        }
        if (props["isDue"]) {
            return {
                backgroundColor: colors.schemes.light.errorContainer,
                color: colors.schemes.light.error
            };
        }
        if (props["isNew"]) {
            return {
                backgroundColor: colors.palettes.primary[90],
                color: colors.palettes.primary[50]
            };
        }
        return { backgroundColor: "transparent", color: "transparent" };
    };

    const tagStyle = getTagStyle();

    const getTagText = () => {
        if (props["isCompleted"]) return "COMPLETED";
        if (props["isDue"]) return "DUE";
        if (props["isNew"]) return "NEW";
        return "";
    };

    return (
        <RowCard
            onPress={handlePress}
            title={props.name}
            imageText={props["imageText"]}
            imageTextColor={"black"}
            imageBackgroundColor={props["imageBackgroundColor"]}
            descriptions={[
                props.type,
                props.durationInMins ? `${props.durationInMins} min` : "",
                props.class,
            ].filter(Boolean)}
            titleTag={
                props.showTag &&
                <>
                    {(props["isNew"] || props["isDue"] || props["isCompleted"]) &&
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 0,
                                paddingHorizontal: 8,
                                backgroundColor: tagStyle.backgroundColor,
                                borderRadius: 100
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: tagStyle.color,
                                }}
                            >
                                {getTagText()}
                            </ThemedText>
                        </View>
                    }
                </>
            }
        />
    )
}