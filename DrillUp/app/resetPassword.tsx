import ButtonField from "@/components/ButtonField";
import TextInputField from "@/components/TextInputField";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MoveLeft } from 'lucide-react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function ResetPassword() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    
    const navigate = (dest: string) => {
        navigation.navigate(dest);
    }

    return (
        <SafeAreaView
            style={{
                backgroundColor: "#FFF",
				display: "flex",
                alignItems: "center",
                justifyContent: "center",
				rowGap: 36,
				paddingVertical: 24,
				paddingHorizontal: 36,
				flex: 1
            }}
        >
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    backgroundColor: "lightgray"
                }}
            >
                <Text
                    style={{
                        fontSize: 60
                    }}
                >
                    🔒
                </Text>
            </View>
            {/* Header */}
            <View
                style={{
                    rowGap: 4
                }}
            >
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 600,
                        textAlign: "center",
                        marginBottom: 4
                    }}
                >
                    Reset Password
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 400,
                        textAlign: "center",
                        color: "gray"
                    }}
                >
                    Enter your email address and we'll send you a link to reset your password.
                </Text>
            </View>
            {/* Form */}
            <View
                style={{
                    display: "flex",
                    rowGap: 12
                }}
            >
                <TextInputField
                    label="Email Address"
                />
                {/* Button */}
                <View
                    style={{
                        display: "flex",
                        rowGap: 4
                    }}
                >
                    <ButtonField
                        title="Send Reset Link"
                    />
                    <TouchableWithoutFeedback
                        onPress={() => navigate("index")}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 4
                            }}
                        >
                            <ArrowLeft
                                size={12}
                                strokeWidth={3}
                            />
                            <Text
                                style={{
                                    fontSize: 14
                                }}
                            >
                                Back to Login
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </SafeAreaView>
    )
}