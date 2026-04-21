import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, margin } from "@/theme";
import { router } from "expo-router";
import HeaderWithBack from "@/components/ui/HeaderWithBack";
import CoachView from "@/components/pages/class/coach/CoachView";
import StudentView from "@/components/pages/class/student/StudentView";
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";
import { getClassById, Class, defaultClass } from "@/services/classes";

export default function ClassPage() {
  const { token, loaded, role } = useAuth();
  const isTeacher = role === "Coach";

  const { id } = useLocalSearchParams<{ id: string }>();
  const jojo_id  = Number(id);
    const [soccerclass, setSoccerClass] = useState(defaultClass);

  async function fetchClass(in_token: string, in_id: number)
  {
    const theclass = await getClassById(in_token, in_id);
    setSoccerClass(theclass);
  }

    useEffect(() => {
      if (!token || !loaded)
      {
        return;
      }
      fetchClass(token, jojo_id);

    }, [token, loaded, jojo_id]);

    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.schemes.light.background
            }}
        >
            <HeaderWithBack
                header= {soccerclass.className}
                onBack={() => router.back()}
                containerStyle={{
                    paddingVertical: margin.xs,
                    paddingHorizontal: margin.sm,
                    borderBottomWidth: 0,
                }}
                buttonStyle={{
                    backgroundColor: "#00000010"
                }}
            />
            {
          isTeacher ? <CoachView
            param_class={soccerclass} /> : <StudentView />
            }
        </SafeAreaView>
    )
}
