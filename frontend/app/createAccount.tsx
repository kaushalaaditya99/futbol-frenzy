import SimpleButton from "@/components/ui/button/SimpleButton";
import InputText from "@/components/ui/input/InputText";
import RadioCard from "@/components/ui/input/RadioCard";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, margin, padding } from "@/theme";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function CreateAccount() {
    return (
        <View
            style={{
                backgroundColor: colors.schemes.light.background,
				rowGap: padding.sm,
				paddingVertical: margin.sm,
				paddingHorizontal: margin.lg,
				flex: 1
            }}
        >
            <View>
                <ThemedText
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        textAlign: "center",
                        marginBottom: 4
                    }}
                >
                    Create Account
                </ThemedText>
                <ThemedText
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                        textAlign: "center",
                        color: colors.schemes.light.onSurfaceVariant
                    }}
                >
                    Join DrillUp and level up your game.
                </ThemedText>
            </View>
            <View
                style={{
                    rowGap: 12
                }}
            >
                <SimpleButton
                    label="Sign Up with Google"
                />
                <SimpleButton
                    label="Sign Up with Apple"
                />
            </View>
            <View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between"
				}}
			>
				<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: colors.schemes.light.onSurfaceVariant}}></View>
				<ThemedText
					style={{
						width: "33%",
						fontSize: fontSize.sm,
						fontWeight: 600,
						color: colors.schemes.light.onSurfaceVariant,
						textAlign: "center"
					}}
				>
					OR WITH EMAIL
				</ThemedText>
				<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: colors.schemes.light.onSurfaceVariant}}></View>
			</View>
            {/* Form */}
            <View
                style={{
                    flex: 1,
                    rowGap: padding.lg
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: padding.lg,
                        width: "100%"
                    }}
                >
                    <InputText
                        label="First Name"
                        inputStyle={{
                            flex: 0.5
                        }}
                    />
                    <InputText
                        label="Last Name"
                        inputStyle={{
                            flex: 0.5
                        }}
                    />
                </View>
                <InputText
                    label="Email Address"
                />
                <InputText
                    label="Password"
                />
                <InputText
                    label="Confirm Password"
                />
                {/* Role */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: padding.lg
                    }}
                >
                    <RadioCard
                        value="Coach"
                        onChange={(value) => console.log(value)}
                        emoji="🧑‍🏫"
                        label="Coach"
                        description="Create and assign drills"
                    />
                    <RadioCard
                        value="Student"
                        onChange={(value) => console.log(value)}
                        emoji="⚽"
                        label="Player"
                        description="Practice and submit drills"
                    />
                </View>
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        rowGap: padding.sm
                    }}
                >
                    <SimpleButton
                        label="Create Account"
                    />
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: padding.sm
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.sm,
                                alignSelf: "flex-start"
                            }}
                        >
                            Already have an account?
                        </ThemedText>
                        <ThemedText
                            onPress={() => router.push("/(tabs)")}
                            style={{
                                fontSize: fontSize.sm,
                                fontWeight: 600,
                                alignSelf: "flex-start"
                            }}
                        >
                            Log In
                        </ThemedText>
                    </View>
                </View>
            </View>
        </View>
    )
}