import SimpleButton from '@/components/ui/button/SimpleButton';
import InputText from '@/components/ui/input/InputText';
import ThemedText from '@/components/ui/ThemedText';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { Redirect, router } from "expo-router";
import { View } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
	return (
		<Redirect
			href="/(tabs)/drills"
		/>
		// <SafeAreaView
		// 	style={{
		// 		backgroundColor: "white",
		// 		display: "flex",
		// 		rowGap: 12,
		// 		paddingVertical: 24,
		// 		paddingHorizontal: 36,
		// 		flex: 1
		// 	}}
		// >
		// 	{/* Header */}
		// 	<View
		// 		style={{
		// 			backgroundColor: "white",
		// 			display: "flex",
		// 			alignItems: "center",
		// 			justifyContent: "center"
		// 		}}
		// 	>
		// 		{/* Icon */}
		// 		<View
		// 			style={{
		// 				width: 80,
		// 				height: 80,
		// 				backgroundColor: "#DDD",
		// 				borderRadius: 8,
		// 				display: "flex",
		// 				alignItems: "center",
		// 				justifyContent: "center",
		// 				marginBottom: 24
		// 			}}
		// 		>
		// 			<ThemedText
		// 				style={{
		// 					fontSize: 60,
		// 				}}
		// 			>
		// 				⚽
		// 			</ThemedText>
		// 		</View>
		// 		<ThemedText
		// 			style={{
		// 				fontSize: 32,
		// 				fontWeight: 600,
		// 				textAlign: "center",
		// 				marginBottom: 4
		// 			}}
		// 		>
		// 			DrillUp
		// 		</ThemedText>
		// 		<ThemedText
		// 			style={{
		// 				fontSize: 16,
		// 				fontWeight: 400,
		// 				textAlign: "center",
		// 				color: "gray"
		// 			}}
		// 		>
		// 			Practice smarter. Play better.
		// 		</ThemedText>
		// 	</View>
		// 	{/* Form 1 */}
		// 	<View
		// 		style={{
		// 			backgroundColor: "white",
		// 			display: "flex",
		// 			rowGap: 12,
		// 		}}
		// 	>
		// 		{/* Email */}
		// 		<InputText
		// 			label="Email"
		// 		/>
		// 		{/* Password (and "Forgot") */}
		// 		<View
		// 			style={{
		// 				display: "flex",
		// 				rowGap: 4,
		// 			}}
		// 		>
		// 			<InputText
		// 				label="Password"
		// 			/>
		// 			<ThemedText
		// 				style={{
		// 					color: "#000000",
		// 					fontSize: 12,
		// 					fontWeight: 600,
		// 					textAlign: "right"
		// 				}}
		// 				onPress={() => router.push("/resetPassword")}
		// 			>
		// 				Forgot Password?
		// 			</ThemedText>
		// 		</View>
		// 		<SimpleButton
		// 			label="Log In"
		// 		/>
		// 	</View>
		// 	{/* Separator */}
		// 	<View
		// 		style={{
		// 			display: "flex",
		// 			flexDirection: "row",
		// 			alignItems: "center",
		// 			justifyContent: "space-between"
		// 		}}
		// 	>
		// 		<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: "gray"}}></View>
		// 		<ThemedText
		// 			style={{
		// 				width: "33%",
		// 				fontSize: 12,
		// 				fontWeight: 600,
		// 				color: "gray",
		// 				textAlign: "center"
		// 			}}
		// 		>
		// 			OR CONTINUE WITH
		// 		</ThemedText>
		// 		<View style={{height: 1, maxHeight: 1, width: "33%", backgroundColor: "gray"}}></View>
		// 	</View>
		// 	{/* Form 2 */}
		// 	<View
		// 		style={{
		// 			display: "flex",
		// 			flex: 1,
		// 			rowGap: 12,
		// 			backgroundColor: "white"
		// 		}}
		// 	>
		// 		<View
		// 			style={{
		// 				display: "flex",
		// 				flex: 1,
		// 				flexDirection: "row",
		// 				columnGap: 12,
		// 				maxHeight: 44,
		// 			}}
		// 		>
		// 			<SimpleButton
		// 				label="Google"
		// 				innerMostStyle={{
		// 					flex: 0.5,
		// 					backgroundColor: "white",
		// 				}}
		// 				textStyle={{
		// 					color: "black"
		// 				}}
		// 			/>
		// 			<SimpleButton
		// 				label="Apple"
		// 				innerMostStyle={{
		// 					flex: 0.5,
		// 					backgroundColor: "white",
		// 				}}
		// 				textStyle={{
		// 					color: "black"
		// 				}}
		// 			/>
		// 		</View>
		// 		<SimpleButton
		// 			label="Continue with Facebook"
		// 			innerMostStyle={{
		// 				backgroundColor: "white",
		// 			}}
		// 			textStyle={{
		// 				color: "black"
		// 			}}
		// 		/>
		// 		<View
		// 			style={{
		// 				display: "flex",
		// 				flexDirection: "row",
		// 				columnGap: 4
		// 			}}
		// 		>
		// 			<ThemedText
		// 				style={{
		// 					fontSize: 12,
		// 					color: "#000",
		// 					alignSelf: "flex-start"
		// 				}}
		// 			>
		// 				Don't have an account?
		// 			</ThemedText>
		// 			<ThemedText
		// 				style={{
		// 					fontSize: 12,
		// 					color: "#000",
		// 					fontWeight: 600,
		// 					alignSelf: "flex-start"
		// 				}}
		// 				onPress={() => router.push("/createAccount")}
		// 			>
		// 				Sign Up
		// 			</ThemedText>
		// 		</View>
		// 	</View>
		// </SafeAreaView>
	);
}
