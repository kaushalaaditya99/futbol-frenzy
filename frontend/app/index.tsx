import SimpleButton from '@/components/ui/button/SimpleButton';
import SimpleHalfWidthButton from '@/components/ui/button/SimpleHalfWidthButton';
import SimpleInlineButton from '@/components/ui/button/SimpleInlineButton';
import InputText from '@/components/ui/input/InputText';
import Separator from '@/components/ui/Separator';
import SeparatorText from '@/components/ui/SeparatorText';
import ThemedText from '@/components/ui/ThemedText';
import { fontSize, padding, theme } from '@/theme';
import { Redirect, router } from "expo-router";
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
	return (
		<SafeAreaView
			style={{
				backgroundColor: theme.colors.schemes.light.background,
				display: "flex",
				rowGap: 12,
				alignItems: "center",
				justifyContent: "center",
				paddingVertical: 24,
				paddingHorizontal: 36,
				flex: 1
			}}
		>
			<View
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<View
					style={{
						width: 80,
						height: 80,
						backgroundColor: "black",
						borderRadius: 100,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 24
					}}
				>
					<ThemedText
						style={{
							fontSize: 60,
						}}
					>
						⚽
					</ThemedText>
				</View>
				<ThemedText
					style={{
						fontSize: 32,
						fontWeight: 600,
						textAlign: "center",
						marginBottom: 4
					}}
				>
					DrillUp
				</ThemedText>
				<ThemedText
					style={{
						fontSize: 16,
						fontWeight: 400,
						letterSpacing: theme.letterSpacing.lg,
						textAlign: "center",
						color: theme.colors.schemes.light.onSurfaceVariant
					}}
				>
					Practice smarter. Play better.
				</ThemedText>
			</View>
			<View
				style={{
					display: "flex",
					rowGap: 12,
				}}
			>
				{/* Email */}
				<InputText
					label="Email"
				/>
				<View
					style={{
						display: "flex",
						rowGap: theme.padding.sm,
					}}
				>
					<InputText
						label="Password"
					/>
					<ThemedText
						style={{
							color: theme.colors.schemes.light.onSurfaceVariant,
							fontSize: 14,
							fontWeight: 500,
							letterSpacing: theme.letterSpacing.xl,
							textAlign: "right"
						}}
						onPress={() => router.push("/resetPassword")}
					>
						Forgot Password?
					</ThemedText>
				</View>
				<SimpleButton
					onPress={() => router.push("/(tabs)")}
					label="Log In"
				/>
			</View>
			<SeparatorText
				text="OR CONTINUE WITH"
			/>
			<View
				style={{
					display: "flex",
					rowGap: 12,
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
					<SimpleHalfWidthButton
						label="Google"
					/>
					<SimpleHalfWidthButton
						label="Apple"
					/>
				</View>
				<SimpleButton
					label="Continue with Facebook"
				/>
				<Pressable
					onPress={() => router.push("/createAccount")}
					style={{
						display: "flex",
						flexDirection: "row",
						columnGap: padding.sm
					}}
				>
					<ThemedText
						style={{
							fontSize: fontSize.md,
							color: theme.colors.schemes.light.onSurfaceVariant,
							letterSpacing: theme.letterSpacing.xl,
							alignSelf: "flex-start"
						}}
					>
						Don't have an account?
					</ThemedText>
					<ThemedText
						style={{
							fontSize: fontSize.md,
							color: theme.colors.schemes.light.onSurfaceVariant,
							fontWeight: 500,
							letterSpacing: theme.letterSpacing.xl,
							alignSelf: "flex-start"
						}}
						onPress={() => router.push("/createAccount")}
					>
						Sign Up
					</ThemedText>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
