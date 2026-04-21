import { View, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/services/extendeduser";
import ThemedText from "@/components/ui/ThemedText";
import { colors, fontSize, borderRadius, margin, padding, theme, letterSpacing } from "@/theme";
import HeaderWithBack from "@/components/ui/HeaderWithBack";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "One special character (!@#$%^&*...)", test: (pw: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
];

export default function ChangePassword() {
  const router = useRouter();
  const { token, role, setAuth } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const allRulesMet = PASSWORD_RULES.every((rule) => rule.test(newPassword));
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSave = async () => {
    if (!token) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!allRulesMet) {
      Alert.alert("Error", "New password does not meet all requirements.");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const data = await changePassword(token, currentPassword, newPassword);
      // Update the auth token since the backend issues a new one
      setAuth(data.token, role);
      Alert.alert("Success", "Password changed successfully.", [
        { text: "OK", onPress: () => router.replace("/settings") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
      <HeaderWithBack
          header="Change Password"
          onBack={() => router.back()}
          containerStyle={{
              paddingVertical: theme.margin.xs,
              paddingHorizontal: theme.margin.sm,
          }}
          buttonStyle={{
              backgroundColor: "#00000010"
          }}
          leftHeader={(
            <Pressable onPress={handleSave} disabled={saving} style={{backgroundColor: theme.colors.schemes.light.surfaceContainerHigh, padding: 6, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
              {saving ? (
                <ActivityIndicator size="small" color={colors.coreColors.primary} />
              ) : (
                <ThemedText style={{ fontSize: fontSize.base, fontWeight: "600", color: colors.coreColors.primary, letterSpacing: theme.letterSpacing.xl }}>
                  Save
                </ThemedText>
              )}
            </Pressable>
          )}
        />
      <ScrollView style={{ flex: 1, padding: margin.sm }}>
        <View style={{ gap: margin.sm }}>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            visible={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            visible={showNew}
            onToggle={() => setShowNew(!showNew)}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            visible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />
        </View>

        {/* Password requirements */}
        <ThemedText
          style={{
            fontSize: fontSize.sm,
            letterSpacing: letterSpacing.xl * 2,
            color: colors.schemes.light.onSurfaceVariant,
            marginTop: padding.lg,
            lineHeight: 18,
          }}
        >
          Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.
        </ThemedText>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <View>
      <ThemedText
        style={{
          fontSize: fontSize.md,
          fontWeight: "500",
          letterSpacing: theme.letterSpacing.sm,
          color: colors.schemes.light.onSurfaceVariant,
          marginBottom: padding.md,
        }}
      >
        {label}
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.schemes.light.surfaceContainerLowest,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.schemes.light.outlineVariant,
          ...theme.shadow.sm
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          style={{
            flex: 1,
            paddingHorizontal: padding.xl,
            paddingVertical: padding.lg,
            fontSize: fontSize.base,
            color: colors.schemes.light.onSurface,
          }}
        />
        <Pressable onPress={onToggle} style={{ paddingHorizontal: padding.xl }}>
          {visible ? (
            <Eye size={20} color={colors.schemes.light.onSurfaceVariant} />
          ) : (
            <EyeOff size={20} color={colors.schemes.light.onSurfaceVariant} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
