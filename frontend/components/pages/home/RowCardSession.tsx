import { colors } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import { Session } from "@/services/sessions";
import RowCard from "@/components/ui/RowCard";
import ThemedText from "@/components/ui/ThemedText";

interface RowCardSessionProps extends Session {
    showTag?: boolean;
}

export default function RowCardSession(props: RowCardSessionProps) {
    return (
        <RowCard
            onPress={() => 1}
            title={props.name}
            imageText={props["imageText"]}
            imageTextColor={"black"}
            imageBackgroundColor={props["imageBackgroundColor"]}
            descriptions={[
                props.type,
                `${props.durationInMins} min`,
                props.class,
            ]}
            titleTag={
                props.showTag &&
                <>
                    {(props["isNew"] || props["isDue"]) &&
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 0,
                                paddingHorizontal: 8,
                                backgroundColor: props["isNew"] ? colors.palettes.primary[90] : colors.palettes.tertiary[95],
                                borderRadius: 100
                            }}
                        >
                            <ThemedText
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: props["isNew"] ? colors.palettes.primary[50] : colors.palettes.tertiary[50],
                                }}
                            >
                                {props["isNew"] ? "NEW" : props["isDue"] ? "DUE" : ""}
                            </ThemedText>
                        </View>
                    }
                </>
            }
        />
    )
}