import { View, ScrollView } from "react-native";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import ColorPicker, { Panel1, HueSlider, ColorFormatsObject } from 'reanimated-color-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import RowCardClass from "@/components/pages/classes/RowCardClass";
import { createClass } from "@/services/classes";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import ThemedText from "@/components/ui/ThemedText";
import InputText from "@/components/ui/input/InputText";
import InputWrapper from "@/components/ui/input/InputWrapper";
import InputLabel from "@/components/ui/input/InputLabel";
import Button from "@/components/ui/button/Button";
import { buttonTheme } from "@/components/ui/button/buttonTheme";
import InlineRadioGroup from "@/components/ui/input/InlineRadioGroup";
import { useAuth } from "@/contexts/AuthContext";
import { loadExtendedProfile, defaultExtendedUser } from "@/services/extendeduser";

interface Errors {
    [inputName: string]: {
        valid: boolean;
        errorMessage: string;
    }
};

export default function CreateClass() {
    const [failed, setFailed] = useState(false);
    const [errors, setErrors] = useState<Errors>();
    const [profile, setProfile] = useState(defaultExtendedUser);

    // Form
    const [className, setClassName] = useState("");
    const [imageText, setImageAbbreviation] = useState("");
    const [imageBackgroundColor, setImageBackgroundColor] = useState("lightgray");
    const [imageTextColor, setImageTextColor] = useState("black");

    // Switch Between Foreground and Background
    const [ground, setGround] = useState("Background");

    // Authentication
    const { token, loaded } = useAuth();

    useEffect(() => {
        if (token) {
            loadExtendedProfile(token).then(setProfile).catch(() => {});
        }
    }, [token]);


    useEffect(() => {
        // There's definitely a better way to go
        // about this, but my fingers are starting to hurt.
        // So, I'm going to try and do the bare minimum for now.
        if (className && className.length > 20) {
            setErrors(errors => ({
                ...errors,
                className: {
                    valid: false,
                    errorMessage: "Class name is too long!"
                }
            }));
        }
        else {
            setErrors(errors => ({
                ...errors,
                className: {
                    valid: true,
                    errorMessage: ""
                }
            }));
        }
    }, [className]);


    const onColorChange = (color: ColorFormatsObject) => {
        if (ground === "Background")
            setImageBackgroundColor(color["hsl"]);
        else
            setImageTextColor(color["hsl"]);
    }


    const onCreateClass = async () => {
        if (!token || !loaded) {
            setFailed(true);
            return;
        }

        const successful = await createClass(
            token,
            className,
            imageBackgroundColor,
            imageTextColor,
            imageText
        );

        if (successful) {
            router.back();
            return;
        }

        setFailed(true);
    }


    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.surface,
            }}
      >
        <ScrollView>
            <HeaderWithBack
                header="Create Class"
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            <View
                style={{
                    backgroundColor: colors.schemes.light.background
                }}
            >
                <View
                    style={{
                        paddingTop: margin.sm - 8,
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        rowGap: padding.md,
                        backgroundColor: colors.schemes.light.background,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 500,
                            letterSpacing: letterSpacing.sm,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        General Information
                    </ThemedText>
                    <InputText
                        label="Name of Class"
                        value={className}
                        errorMessage={errors?.className?.errorMessage}
                        onChangeText={setClassName}
                    />
                </View>
                <View
                    style={{
                        paddingTop: margin.sm - 8,
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        rowGap: padding.md,
                        backgroundColor: colors.schemes.light.background,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 500,
                            letterSpacing: -0.375,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Making the Card
                    </ThemedText>
                    <View
                        style={{
                            marginBottom: padding.sm
                        }}
                    >
                        <ColorPicker
                            style={{
                                width: "100%",
                                borderRadius: borderRadius.base,
                                ...shadow.md
                            }}
                            value="black"
                            onChangeJS={onColorChange}
                        >
                            <InlineRadioGroup
                                value={ground}
                                options={[["Background", "BACKGROUND"], ["Foreground", "FOREGROUND"]]}
                                onChange={(value) => setGround(value)}
                                containerStyle={{
                                    borderBottomWidth: 0,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                }}
                            />
                            <View
                                style={{
                                    overflow: "hidden",
                                    borderWidth: 1,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                <Panel1
                                    style={{
                                        borderRadius: 0,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    overflow: "hidden",
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomLeftRadius: borderRadius.base,
                                    borderBottomRightRadius: borderRadius.base,
                                    borderWidth: 1,
                                    borderTopWidth: 0,
                                    borderColor: colors.schemes.light.outlineVariant,
                                }}
                            >
                                <HueSlider
                                    style={{
                                        borderRadius: 0,
                                    }}
                                />
                            </View>
                        </ColorPicker>
                    </View>
                    <InputText
                        label="Abbreviation"
                        value={imageText}
                        onChangeText={setImageAbbreviation}
                        inputStyle={{
                            paddingBottom: padding.lg
                        }}
                    />
                    <View
                        style={{
                            paddingTop: margin.sm - 8,
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant,
                            borderStyle: "dashed"
                        }}
                    >
                        <InputWrapper>
                            <InputLabel
                                label="Card Preview"
                                labelStyle={{
                                    fontSize: fontSize.base,
                                    fontWeight: 500,
                                    letterSpacing: -0.25,
                                    textAlign: "center",
                                    marginBottom: padding.md
                                }}
                            />
                            <RowCardClass
                                id={0}
                                className={className || "Class Name"}
                                coach={{
                                    id: profile.id,
                                    first_name: profile.first_name,
                                    last_name: profile.last_name,
                                    email: profile.email,
                                    username: profile.username
                                }}
                                students={[]}
                                imageText={imageText}
                                imageTextColor={imageTextColor}
                                imageBackgroundColor={imageBackgroundColor}
                            />
                        </InputWrapper>
                    </View>
                </View>
            </View>
            <View
                style={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    backgroundColor: colors.schemes.light.background,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                }}
            >
                <Button
                    onPress={onCreateClass}
                    {...buttonTheme.blue}
                    innerStyle={{
                        width: "100%"
                    }}
                >
                    <Plus
                        size={18}
                        strokeWidth={2.5}
                        color="white"
                    />
                    <ThemedText
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: -0.25,
                            color: "white"
                        }}
                    >
                        Create Class
                    </ThemedText>
                </Button>
        </View>
        </ScrollView>
        </SafeAreaView>
    )
}
