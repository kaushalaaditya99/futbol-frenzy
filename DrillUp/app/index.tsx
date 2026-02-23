import ButtonField from "@/components/ButtonField";
import TextInputField from "@/components/TextInputField";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { Text, Touchable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

	const navigate = (dest: string) => {
		navigation.navigate(dest);
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "white",
				display: "flex",
				rowGap: 12,
				paddingVertical: 24,
				paddingHorizontal: 36,
				flex: 1
			}}
		>
			{/* Header */}
			<View
				style={{
					backgroundColor: "white",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				{/* Icon */}
				<View
					style={{
						width: 80,
						height: 80,
						backgroundColor: "#DDD",
						borderRadius: 8,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 24
					}}
				>
					<Text
						style={{
							fontSize: 60,
						}}
					>
						⚽
					</Text>
				</View>
				<Text
					style={{
						fontSize: 32,
						fontWeight: 600,
						textAlign: "center",
						marginBottom: 4
					}}
				>
					DrillUp
				</Text>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 400,
						textAlign: "center",
						color: "gray"
					}}
				>
					Practice smarter. Play better.
				</Text>
			</View>
			{/* Form 1 */}
			<View
				style={{
					backgroundColor: "white",
					display: "flex",
					rowGap: 12,
				}}
			>
				{/* Email */}
				<TextInputField
					label="Email"
				/>
				{/* Password (and "Forgot") */}
				<View
					style={{
						display: "flex",
						rowGap: 4,
					}}
				>
					<TextInputField
						label="Password"
					/>
					<Text
						style={{
							color: "#000000",
							fontSize: 12,
							fontWeight: 600,
							textAlign: "right"
						}}
						onPress={() => navigate("resetPassword")}
					>
						Forgot Password?
					</Text>
				</View>
				<ButtonField
					title="Log In"
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
					OR CONTINUE WITH
				</Text>
				<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: "gray"}}></View>
			</View>
			{/* Form 2 */}
			<View
				style={{
					display: "flex",
					flex: 1,
					rowGap: 12,
					backgroundColor: "white"
				}}
			>
				<View
					style={{
						display: "flex",
						flex: 1,
						flexDirection: "row",
						columnGap: 12,
						maxHeight: 44,
					}}
				>
					<ButtonField
						title="Google"
						style={{
							flex: 0.5,
							backgroundColor: "white",
						}}
						textStyle={{
							color: "black"
						}}
					/>
					<ButtonField
						title="Apple"
						style={{
							flex: 0.5,
							backgroundColor: "white",
						}}
						textStyle={{
							color: "black"
						}}
					/>
				</View>
				<ButtonField
					title="Continue with Facebook"
					style={{
						backgroundColor: "white",
					}}
					textStyle={{
						color: "black"
					}}
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
							color: "#000",
							alignSelf: "flex-start"
						}}
					>
						Don't have an account?
					</Text>
					<Text
						style={{
							fontSize: 12,
							color: "#000",
							fontWeight: 600,
							alignSelf: "flex-start"
						}}
						onPress={() => navigate("createAccount")}
					>
						Sign Up
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
