import { colors } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
import ThemedText from "../ThemedText";
import { Session } from "@/services/sessions";
import RowCardWrapper from "../RowCardWrapper";

interface SessionProps extends Session {
    showTag?: boolean;
}

export default function CardSession(props: SessionProps) {
    return (
        <RowCardWrapper
            title={props.name}
            imageBackgroundColor={props["imageBackgroundColor"]}
            imageTextColor={"black"}
            imageText={props["imageText"]}
            descriptions={[
                props.type,
                `${props.durationInMins} min`,
                props.class,
            ]}
            titleTag={
                props.showTag ?
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
                : <></>
            }
            onPress={() => router.push('/demonstration')}
        />
    )
}