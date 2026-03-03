import CalendarNavigate from "@/components/ui/calendar/CalendarNavigate";
import WeekSegmentedButtonGroup from "@/components/ui/calendar/WeekSegmentedButtonGroup";
import useFunctionalDate from "@/hooks/useFunctionalDate"
import { View } from "react-native";

interface SmallCalendarProps {
    functionalDate: ReturnType<typeof useFunctionalDate>;
}

export default function SmallCalendar(props: SmallCalendarProps) {
    return (
        <View>
            <CalendarNavigate
                functionalDate={props.functionalDate}
                long={true}
                dateLabelLong={true}
                containerStyle={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }}
                middleButtonContainerStyle={{
                    flex: 1,
                    justifyContent: "center"
                }}
            />
            <WeekSegmentedButtonGroup
                dateOffset={props.functionalDate.dateOffset}
                setDateOffset={props.functionalDate.setDateOffset}
                buttonStyle={(day, i) => ({
                    borderTopWidth: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                })}
            />
        </View>
    )
}