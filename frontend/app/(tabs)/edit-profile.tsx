import { View, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { patchUser, patchUserSettings } from "@/services/extendeduser";
import ThemedText from "@/components/ui/ThemedText";
import ProfilePicture from "@/components/ui/user/ProfilePicture";
import { colors, fontSize, borderRadius, margin, padding } from "@/theme";

const POSITIONS = [
  { label: "Goalkeeper", value: "GK" },
  { label: "Defender", value: "DF" },
  { label: "Midfielder", value: "MF" },
  { label: "Forward", value: "FW" },
];

export default function EditProfile() {
  const router = useRouter();
  const { token, role } = useAuth();
  const { profile, refreshProfile } = useProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setUsername(profile.username);
    setEmail(profile.email);
    setPosition(profile.position);
  }, [profile]);

  const handleSave = async () => {
    if (!token) return;
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      // Update User model fields (name, email, username)
      await patchUser(profile.id, token, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
      });

      // Update Settings model fields (position)
      if (role !== "Coach") {
        await patchUserSettings(profile.id, token, {
          position: position,
        });
      }

      await refreshProfile();
      Alert.alert("Success", "Profile updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Failed to update profile:", err);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.schemes.light.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: margin.sm,
          paddingVertical: padding.lg,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ marginRight: padding.lg }}>
          <ArrowLeft size={24} color={colors.schemes.light.onBackground} />
        </Pressable>
        <ThemedText style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.schemes.light.onBackground, flex: 1 }}>
          Edit Profile
        </ThemedText>
        <Pressable onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.coreColors.primary} />
          ) : (
            <ThemedText style={{ fontSize: fontSize.base, fontWeight: "600", color: colors.coreColors.primary }}>
              Save
            </ThemedText>
          )}
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: margin.sm }}>
        {/* Profile Picture */}
        <View style={{ alignItems: "center", marginBottom: margin.sm }}>
          <View style={{ position: "relative" }}>
            <ProfilePicture width={96} height={96} />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: colors.coreColors.primary,
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.schemes.light.background,
              }}
            >
              <Camera size={16} color="#FFFFFF" />
            </View>
          </View>
          <ThemedText
            style={{
              fontSize: fontSize.md,
              color: colors.coreColors.primary,
              fontWeight: "600",
              marginTop: padding.lg,
            }}
          >
            Change Photo
          </ThemedText>
        </View>

        {/* Form Fields */}
        <View style={{ gap: margin["3xs"] }}>
          <FormField label="First Name" value={firstName} onChangeText={setFirstName} />
          <FormField label="Last Name" value={lastName} onChangeText={setLastName} />
          <FormField label="Username" value={username} onChangeText={setUsername} />
          <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          {role !== "Coach" && (
            <View>
              <ThemedText
                style={{
                  fontSize: fontSize.md,
                  fontWeight: "600",
                  color: colors.schemes.light.onSurfaceVariant,
                  marginBottom: padding.md,
                }}
              >
                Position
              </ThemedText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: padding.md }}>
                {POSITIONS.map((pos) => (
                  <Pressable
                    key={pos.value}
                    onPress={() => setPosition(pos.value)}
                    style={{
                      paddingHorizontal: padding.xl,
                      paddingVertical: padding.lg,
                      borderRadius: borderRadius.lg,
                      backgroundColor:
                        position === pos.value
                          ? colors.coreColors.primary
                          : colors.schemes.light.surfaceContainerHigh,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: fontSize.md,
                        fontWeight: "600",
                        color:
                          position === pos.value
                            ? "#FFFFFF"
                            : colors.schemes.light.onSurface,
                      }}
                    >
                      {pos.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View>
      <ThemedText
        style={{
          fontSize: fontSize.md,
          fontWeight: "600",
          color: colors.schemes.light.onSurfaceVariant,
          marginBottom: padding.md,
        }}
      >
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize}
        style={{
          backgroundColor: colors.schemes.light.surfaceContainerLowest,
          borderRadius: borderRadius.lg,
          paddingHorizontal: padding.xl,
          paddingVertical: padding.lg,
          fontSize: fontSize.base,
          color: colors.schemes.light.onSurface,
          borderWidth: 1,
          borderColor: colors.schemes.light.outlineVariant,
        }}
      />
    </View>
  );
}
