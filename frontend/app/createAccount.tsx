import ButtonField from "@/components/ButtonField";
import EmojiRadioButtonField from "@/components/EmojiRadioButtonField";
import TextInputField from "@/components/TextInputField";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function CreateAccount() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    
    const navigate = (dest: string) => {
        navigation.navigate(dest);
    }
    
    return (
        <View
            style={{
                backgroundColor: "#FFF",
				display: "flex",
				rowGap: 12,
				paddingVertical: 24,
				paddingHorizontal: 36,
				flex: 1
            }}
        >
            {/* Header */}
            <View>
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        textAlign: "center",
                        marginBottom: 4
                    }}
                >
                    Create Account
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                        textAlign: "center",
                        color: "gray"
                    }}
                >
                    Join DrillUp and level up your game.
                </Text>
            </View>
            {/* Google, Apple */}
            <View
                style={{
                    rowGap: 12
                }}
            >
                <ButtonField
                    title="Sign Up with Google"
                    style={{
                        backgroundColor: "white",
                    }}
                    textStyle={{
                        color: "black"
                    }}
                />
                <ButtonField
                    title="Sign Up with Apple"
                    style={{
                        backgroundColor: "white",
                    }}
                    textStyle={{
                        color: "black"
                    }}
                />
            </View>
            {/* Separator */}
            <View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between"
				}}
			>
				<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: "gray"}}></View>
				<Text
					style={{
						width: "33%",
						fontSize: 12,
						fontWeight: 600,
						color: "gray",
						textAlign: "center"
					}}
				>
					OR WITH EMAIL
				</Text>
				<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: "gray"}}></View>
			</View>
            {/* Form */}
            <View
                style={{
                    display: "flex",
                    flex: 1,
                    rowGap: 12
                }}
            >
                <View
                    style={{
                        display: "flex",
                        columnGap: 12,
                        flexDirection: "row",
                        width: "100%"
                    }}
                >
                    <TextInputField
                        label="First Name"
                        containerStyle={{
                            flex: 0.5
                        }}
                    />
                    <TextInputField
                        label="Last Name"
                        containerStyle={{
                            flex: 0.5
                        }}
                    />
                </View>
                <TextInputField
                    label="Email Address"
                />
                <TextInputField
                    label="Password"
                />
                <TextInputField
                    label="Confirm Password"
                />
                {/* Role */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 12
                    }}
                >
                    <EmojiRadioButtonField
                        value={true}
                        emoji="🧑‍🏫"
                        label="Coach"
                        description="Create and assign drills"
                    />
                    <EmojiRadioButtonField
                        value={false}
                        emoji="⚽"
                        label="Player"
                        description="Practice and submit drills"
                    />
                </View>
                {/* Create Account Button (and "Log In") */}
                <View
                    style={{
                        display: "flex",
                        alignItems: "center",
                        rowGap: 4
                    }}
                >
                    <ButtonField
                        title="Create Account"
                    />
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 4
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                alignSelf: "flex-start"
                            }}
                        >
                            Already have an account?
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                alignSelf: "flex-start"
                            }}
                            onPress={() => navigate("index")}
                        >
                            Log In
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}