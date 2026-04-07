import { colors, fontSize, letterSpacing, margin, padding } from "@/theme";
import { ArrowLeftFromLine, DumbbellIcon, Settings, ZapIcon } from "lucide-react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePicture from "../ProfilePicture";
import ThemedText from "../../ThemedText";
import { SideBarLink } from "./SideBarLink";
import { View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { router, useRouter } from "expo-router";
import { ExtendedUser, loadExtendedProfile, defaultExtendedUser } from "@/services/extendeduser";
import { useState, useEffect } from "react";

interface SideBarProps {
    targetWidth: number;
    animatedExpandFromLeft: {
        minWidth: number;
    }
}

export default function SideBar(props: SideBarProps) {
  const { logout, token, loaded, role } = useAuth();
  const [profile, setProfile] = useState(defaultExtendedUser);
    const navigation = useNavigation();

    const logOut = async () => {
        await logout();
        navigation.getParent()?.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: "index" }] })
        );
    }


    useEffect(() => {
      if (!loaded || !token || !role) return;
      async function loadProfile(escapedtoken: string)
      {
        try
        {
          const userProfile = await loadExtendedProfile(escapedtoken);
          setProfile(userProfile);
        }
        catch(err)
        {
          console.log("Error retrieving user data: ", err)
          throw err;
        }
      }
      if (token != null)
      {
        loadProfile(token)
      }
    }, [loaded, token, role]);


    const router = useRouter();
    return (
        <Animated.View
            style={[
                {
                    flex: 1,
                    backgroundColor: colors.schemes.light.background,
                },
                props.animatedExpandFromLeft
            ]}
        >
            <SafeAreaView
                edges={["top"]}
                style={{
                    minWidth: props.targetWidth,
                    flex: 1,
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        paddingVertical: margin.sm,
                        paddingHorizontal: margin.sm,
                        rowGap: padding.lg,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <ProfilePicture
                        width={48}
                        height={48}
                        onClick={() => router.push("/profile")}
                    />
                    <View>
                        <ThemedText
                            style={{
                                marginBottom: 1,
                                fontSize: fontSize.md,
                                fontWeight: 500,
                                letterSpacing: letterSpacing.lg,
                                color: colors.schemes.light.onSurfaceVariant,
                            }}
                        >
                            Good Morning,
                        </ThemedText>
                        <ThemedText
                            style={{
                                fontSize: fontSize.lg,
                                fontWeight: 600,
                                letterSpacing: letterSpacing.sm,
                                color: colors.schemes.light.onSurface
                            }}
                        >
                            {profile.first_name} {profile.last_name}
                        </ThemedText>
                    </View>
                </View>
                <View
                    style={{
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant
                    }}
                >
                    <SideBarLink
                        icon={
                            <ZapIcon
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Drills"
                        onPress={() => router.replace("/(tabs)/drills")}
                    />
                    <SideBarLink
                        icon={
                            <DumbbellIcon
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Workouts"
                        containerStyle={{
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                        onPress={() => router.replace("/(tabs)/workouts")}
                    />
                    <SideBarLink
                        icon={
                            <Settings
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Settings"
                        onPress={() => router.replace("/(tabs)/settings")}
                        containerStyle={{
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                    />
                    <SideBarLink
                        icon={
                            <ArrowLeftFromLine
                                size={18}
                                color={colors.schemes.light.onSurfaceVariant}
                            />
                        }
                        label="Log Out"
                        onPress={logOut}
                        containerStyle={{
                            borderTopWidth: 1,
                            borderColor: colors.schemes.light.outlineVariant
                        }}
                    />
                </View>
            </SafeAreaView>
        </Animated.View>
    )
}
