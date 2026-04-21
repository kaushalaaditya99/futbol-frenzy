import { View, Switch, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import SettingsRow from "@/components/SettingsRow";
import { Divider } from "@/components/Common";
import {
  User,
  Lock,
  Link,
  Bell,
  Film,
  Moon,
  HelpCircle,
  MessageSquare,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { ExtendedUser, loadExtendedProfile, defaultExtendedUser, patchUserSettings } from "@/services/extendeduser";
import ThemedText from "@/components/ui/ThemedText";
import ProfilePicture from "@/components/ui/user/ProfilePicture";
import { colors, fontSize, letterSpacing, borderRadius, margin, padding, theme, shadow } from "@/theme";
import useSideBar from "@/components/ui/user/sideBar/useSideBar";
import SideBar from "@/components/ui/user/sideBar/SideBar";
import SideBarDim from "@/components/ui/user/sideBar/SideBarDim";
import Header from "@/components/ui/user/Header";


export default function Settings() {
  const sideBar = useSideBar();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(defaultExtendedUser);

  const [id, setId] = useState("");
  const { token, loaded, role } = useAuth();
  const router = useRouter();

  const toggleDarkMode = async (currentSetting: boolean) => {
    if (!token)
    {
      // console.log("User hasn't been properly authenticated")
      return;
    }
    setDarkMode(currentSetting);
    const payload = { isDarkMode: darkMode };
    patchUserSettings(userData.id, token, payload);
  };

  useEffect(() => {
    if (!loaded || !token || !role) return;
    async function loadProfile(escapedtoken: string)
    {
      try
      {
        const userData = await loadExtendedProfile(escapedtoken);
        setUserData(userData);
      }
      catch(err)
      {
        // console.log("Error retrieving user data: ", err)
        throw err;
      }
    }
    if (token != null && role != null)
    {
      loadProfile(token)
    }
  }, [loaded, token, role]);

  return (
    <View
        style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "black"
        }}
    >
      <SideBar
          targetWidth={sideBar.sideBarTargetWidth}
          animatedExpandFromLeft={sideBar.animatedExpandFromLeft}
      />
      <SafeAreaView 
        edges={["top"]}
        style={{ 
          flex: 1, 
          width: Dimensions.get('window').width,
          minWidth: Dimensions.get('window').width,
          backgroundColor: theme.colors.schemes.light.background,
          position: "relative"
        }}
      >
        {sideBar.showSideBar &&
            <SideBarDim
                setShowSideBar={sideBar.setShowSideBar}
            />
        }
        <Header
            openSideBar={sideBar.openSideBar}
        />
        <ScrollView style={{ flex: 1, padding: margin.sm, backgroundColor: theme.colors.schemes.light.background }}>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: margin.sm,
            }}
          >
            <SettingsIcon 
              size={28} 
              color={colors.schemes.light.onBackground} 
              style={{ marginRight: padding.md }} 
            />
            <ThemedText 
              style={{ fontSize: fontSize.xl, fontWeight: "700", color: colors.schemes.light.onBackground }}
            >
              Settings
            </ThemedText>
          </View> */}
          <View
            style={{
              backgroundColor: colors.schemes.light.surfaceContainerLowest,
              borderRadius: borderRadius.lg,
              padding: padding.xl,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: margin.sm,
              borderWidth: 1,
              borderColor: colors.schemes.light.outlineVariant,
              ...shadow.sm
            }}
          >
            <View style={{ marginRight: padding.lg }}>
              <ProfilePicture width={64} height={64} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: fontSize.base + 2, fontWeight: "600", color: colors.schemes.light.onSurface }}>
                {userData.first_name} {userData.last_name}
              </ThemedText>
              <ThemedText style={{ fontSize: fontSize.base, color: colors.schemes.light.onSurfaceVariant }}>{userData.email}</ThemedText>
              <View style={{ flexDirection: "row", marginTop: padding.md, columnGap: padding.md }}>
                <View
                  style={{
                    backgroundColor: colors.schemes.light.surfaceContainerHigh,
                    borderRadius: borderRadius.lg,
                    paddingHorizontal: padding.lg,
                    paddingVertical: padding.xs,
                  }}
                >
                  <ThemedText style={{ fontSize: fontSize.sm, fontWeight: "500", color: colors.schemes.light.onSurface, letterSpacing: letterSpacing.lg }}>{role}</ThemedText>
                </View>
                <View
                  style={{
                    backgroundColor: colors.schemes.light.surfaceContainerHigh,
                    borderRadius: borderRadius.lg,
                    paddingHorizontal: padding.lg,
                    paddingVertical: padding.xs,
                  }}
                >
                  <ThemedText style={{ fontSize: fontSize.sm, fontWeight: "500", color: colors.schemes.light.onSurface }}>{userData.position}</ThemedText>
                </View>
              </View>
            </View>
          </View>

          <ThemedText
            style={{
              fontSize: fontSize.md,
              fontWeight: "700",
              color: colors.schemes.light.onSurfaceVariant,
              marginBottom: padding.md,
            }}
          >
            ACCOUNT
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.schemes.light.surfaceContainerLowest,
              borderRadius: borderRadius.lg,
              marginBottom: margin.sm,
              // overflow: "hidden",
              ...shadow.sm,
              borderWidth: 1,
              borderColor: colors.schemes.light.outlineVariant
            }}
          >
            <SettingsRow icon={User} label="Edit Profile" onPress={() => router.push("/edit-profile")} />
            <Divider />
            <SettingsRow icon={Lock} label="Change Password" onPress={() => router.push("/change-password")} />
            <Divider />
            <SettingsRow icon={Link} label="Connected Accounts" rightText="G" />
          </View>

          <ThemedText
            style={{
              fontSize: fontSize.md,
              fontWeight: "700",
              color: colors.schemes.light.onSurfaceVariant,
              marginBottom: padding.md,
            }}
          >
            PREFERENCES
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.schemes.light.surfaceContainerLowest,
              borderRadius: borderRadius.lg,
              marginBottom: margin.sm,
              // overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.schemes.light.outlineVariant,
              ...shadow.sm
            }}
          >
            <SettingsRow icon={Bell} label="Notifications" />
            <Divider />
            <SettingsRow icon={Film} label="Video Quality" />
            <Divider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: padding.xl,
                paddingVertical: padding.lg,
              }}
            >
              <Moon size={20} color={colors.schemes.light.onSurfaceVariant} style={{ marginRight: padding.lg }} />
              <ThemedText style={{ fontSize: fontSize.base, flex: 1, color: colors.schemes.light.onSurface }}>Dark Mode</ThemedText>
              <Switch
                value={darkMode}
                onValueChange={(newValue) => toggleDarkMode(newValue)}
                trackColor={{ false: colors.schemes.light.outlineVariant, true: colors.coreColors.tertiary }}
              />
            </View>
          </View>

          <ThemedText
            style={{
              fontSize: fontSize.md,
              fontWeight: "700",
              color: colors.schemes.light.onSurfaceVariant,
              marginBottom: padding.md,
            }}
          >
            SUPPORT
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.schemes.light.surfaceContainerLowest,
              borderRadius: borderRadius.lg,
              marginBottom: 40,
              // overflow: "hidden",
              ...shadow.sm,
              borderWidth: 1,
              borderColor: colors.schemes.light.outlineVariant
            }}
          >
            <SettingsRow icon={HelpCircle} label="Help & FAQ" />
            <Divider />
            <SettingsRow icon={MessageSquare} label="Contact Support" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
