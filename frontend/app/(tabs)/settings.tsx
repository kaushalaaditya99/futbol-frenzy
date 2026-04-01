import { Text, View, Switch, ScrollView } from "react-native";
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
import { useAuth } from "@/contexts/AuthContext";
import resolveEndpoint from "@/services/resolveEndpoint";
import { ExtendedUser, loadExtendedProfile, defaultExtendedUser } from "@/services/extendeduser";


export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(defaultExtendedUser);
  const [pfp, setPfp] = useState("");
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Rivera");
  const [email, setEmail] = useState("alexrivera@yahoo.com");
  const [tag1, setTag1] = useState("Player");
  const [tag2, setTag2] = useState("Midfielder");
  const [id, setId] = useState("");
  const { token, loaded, role } = useAuth();
  const [profile, setProfile] = useState(null);

  const toggleDarkMode = async (currentSetting: boolean) => {
    setDarkMode(currentSetting);
    const payload = { isDarkMode: darkMode };
    const updateDarkMode = await fetch(`${API_URL}settings/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  useEffect(() => {
    if (!loaded || !token || !role) return;
    /*
    async function loadProfile() {
      const resMe = await fetch(`${API_URL}users/me`, {
        headers: { Authorization: `Token ${token}` },
      });
      const me = await resMe.json();

      const resUser = await fetch(`${API_URL}user/${me.id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      const user = await resUser.json();

      const resSettings = await fetch(`${API_URL}settings/${me.id}`, {
        headers: { Authorization: `Token ${token}` },
      });

      const userSettings = await resSettings.json();

      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setPfp(user.profilePicture);
      setId(user.id);
      if (!role) setTag1("Unknown");
      else setTag1(role);

      setTag2(userSettings.position);
      setDarkMode(userSettings.isDarkMode);
    }

    loadProfile();
      */
    async function loadProfile(escapedtoken: string, escapedrole: string)
    {
      try
      {
        const userData = await loadExtendedProfile(escapedtoken, escapedrole);
        setUserData(userData);
      }
      catch(err)
      {
        console.log("Error retrieving user data: ", err)
        throw err;
      }
    }
    if (token != null && role != null)
    {
      loadProfile(token, role)
    }
  }, [loaded, token, role]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <SettingsIcon size={28} color="black" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Settings</Text>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#E0E0E0",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#555" }}>
              AR
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>
              {userData.first_name} {userData.last_name}
            </Text>
            <Text style={{ fontSize: 13, color: "gray" }}>{userData.email}</Text>
            <View style={{ flexDirection: "row", marginTop: 6, columnGap: 8 }}>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>{role}</Text>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>{userData.position}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "gray",
            marginBottom: 8,
          }}
        >
          ACCOUNT
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <SettingsRow icon={User} label="Edit Profile" />
          <Divider />
          <SettingsRow icon={Lock} label="Change Password" />
          <Divider />
          <SettingsRow icon={Link} label="Connected Accounts" rightText="G" />
        </View>

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "gray",
            marginBottom: 8,
          }}
        >
          PREFERENCES
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            marginBottom: 24,
            overflow: "hidden",
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
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Moon size={20} color="#555" style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 16, flex: 1 }}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={(newValue) => toggleDarkMode(newValue)}
              trackColor={{ false: "#DDD", true: "#4CD964" }}
            />
          </View>
        </View>

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "gray",
            marginBottom: 8,
          }}
        >
          SUPPORT
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            marginBottom: 40,
            overflow: "hidden",
          }}
        >
          <SettingsRow icon={HelpCircle} label="Help & FAQ" />
          <Divider />
          <SettingsRow icon={MessageSquare} label="Contact Support" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
