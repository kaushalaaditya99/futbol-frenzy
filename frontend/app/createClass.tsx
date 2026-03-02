import { Modal, Pressable, TextInput, View } from "react-native";
import { borderRadius, colors, fontSize, letterSpacing, margin, padding, shadow } from "@/theme";
import { CircleX, Plus, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, Panel2, Panel3, Panel4, Panel5, ColorFormatsObject } from 'reanimated-color-picker';
import TextInputField from "@/components/TextInputField";
import ThemedText from "@/components/ThemedText";
import Button, { buttonThemes } from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBack from "@/components/HeaderWithBack";
import { router } from "expo-router";
import InputLabel from "@/components/SideBar/InputLabel";
import InputWrapper from "@/components/SideBar/InputWrapper";
import CardClass from "@/components/Classes/CardClass";
import { createClass } from "@/services/classes";

interface Errors {
    [inputName: string]: {
        valid: boolean; 
        errorMessage: string;
    }
};

export default function CreateClass() {
    const [failed, setFailed] = useState(false);
    const [errors, setErrors] = useState<Errors>();

    const [teacherName, setCoachName] = useState("");
    const [className, setClassName] = useState("");
    const [imageAbbreviation, setImageAbbreviation] = useState("");
    const [imageBackgroundColor, setImageBackgroundColor] = useState("lightgray");
    const [imageTextColor, setImageTextColor] = useState("black");
    const [ground, setGround] = useState("Background");


    useEffect(() => {
        load();
    }, []);


    useEffect(() => {
        // There's definitely a better way to go
        // about this, but my fingers are starting to hurt.
        // So, I'm going to try and do the bare minimum for now.
        if (className && className.length > 5) {
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


    const load = async () => {
        // You'd need to call the actual function here to
        // fetch any data you need for this process.
        setCoachName("Kafka");
    }


    const onColorChange = (color: ColorFormatsObject) => {
        if (ground === "Background")
            setImageBackgroundColor(color["hsl"]);
        else
            setImageTextColor(color["hsl"]);
    }


    const onCreateClass = async () => {
        const teacherID = 0;
        const successful = await createClass(
            teacherID, 
            className, 
            imageBackgroundColor, 
            imageTextColor, 
            imageAbbreviation
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
                    <TextInputField
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
                            <View
                                style={{
                                    padding: padding.sm,
                                    flexDirection: "row",
                                    borderWidth: 1,
                                    borderBottomWidth: 0,
                                    borderColor: colors.schemes.light.outlineVariant,
                                    borderRadius: borderRadius.base,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    backgroundColor: colors.schemes.light.surface,
                                    ...shadow.sm
                                }}
                            >
                                {["Background", "Foreground"].map((ground_, i) => (
                                    <Pressable
                                        key={i}
                                        onPress={() => setGround(ground_)}
                                        style={Object.assign({},
                                            {
                                                flex: 1,
                                                paddingVertical: padding.lg,
                                                paddingHorizontal: padding.lg,
                                            },
                                            ground_ === ground &&
                                            {
                                                "backgroundColor": "white",
                                                "borderWidth": 1,
                                                "borderColor": colors.schemes.light.outlineVariant,
                                                "borderRadius": borderRadius.md,
                                                ...shadow.sm
                                            }
                                        )}
                                    >
                                        <ThemedText
                                            style={{
                                                fontSize: 12,
                                                fontWeight: ground === ground_ ? 600 : 400,
                                                letterSpacing: letterSpacing.md,
                                                color: ground === ground_ ? colors.schemes.light.onSurface : colors.schemes.light.onSurfaceVariant,
                                                textAlign: "center"
                                            }}
                                        >
                                            {ground_.toUpperCase()}
                                        </ThemedText>
                                    </Pressable>
                                ))}
                            </View>
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
                    <TextInputField
                        label="Abbreviation"
                        value={imageAbbreviation}
                        onChangeText={setImageAbbreviation}
                        containerStyle={{
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
                            <CardClass
                                id={0}
                                name={className || "Class Name"}
                                numStudents={15}
                                teacherName={teacherName}
                                imageText={imageAbbreviation}
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
                    outerStyle={{
                        ...shadow.sm
                    }}
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
                <View
                    style={{
                        marginHorizontal: 24,
                        marginVertical: 6,
                        marginBottom: 24,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        flexDirection: "row",
                        alignItems: "flex-start",
                        columnGap: 6,
                        borderWidth: 1,
                        borderColor: colors.schemes.light.error,
                        borderStyle: "dashed",
                        borderRadius: 8,
                        backgroundColor: colors.schemes.light.errorContainer,
                        opacity: failed ? 1 : 0
                    }}
                >
                    <CircleX
                        size={14}
                        color={colors.schemes.light.onErrorContainer}
                        style={{
                            position: "relative",
                            top: 1.5
                        }}
                    />
                    <View
                        style={{
                            flexShrink: 1,
                        }}
                    >
                        <ThemedText
                            style={{
                                flexShrink: 1,
                                fontSize: 12,
                                fontWeight: 400,
                                letterSpacing: 0.25,
                                color: colors.schemes.light.onErrorContainer
                            }}
                        >
                            A class with this code was not found. Please try again.
                        </ThemedText>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}