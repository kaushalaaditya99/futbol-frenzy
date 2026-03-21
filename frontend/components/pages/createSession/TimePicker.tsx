import ThemedText from "@/components/ui/ThemedText";
import { borderRadius, colors, fontSize, letterSpacing } from "@/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface TimePickerProps {
    visible: boolean;
    value: Date;
    onConfirm: (date: Date) => void;
    onClose: () => void;
}

export default function TimePicker({ visible, value, onConfirm, onClose }: TimePickerProps) {
    const [pendingTime, setPendingTime] = useState(value);

    // Reset pending selection each time the sheet opens
    useEffect(() => {
        if (visible) setPendingTime(value);
    }, [visible]);

    // Slide-up animation
    const slideAnim = useRef(new Animated.Value(400)).current;
    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 400,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Dimmed backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.schemes.light.background,
                    borderTopLeftRadius: borderRadius.xl,
                    borderTopRightRadius: borderRadius.xl,
                    transform: [{ translateY: slideAnim }],
                    overflow: "hidden",
                }}
            >
                {/* Handle */}
                <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
                    <View
                        style={{
                            width: 36,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: colors.schemes.light.outlineVariant,
                        }}
                    />
                </View>

                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: fontSize.lg,
                            fontWeight: 600,
                            letterSpacing: letterSpacing.xs,
                            color: colors.schemes.light.onSurface,
                        }}
                    >
                        Select Time
                    </ThemedText>
                    <Pressable onPress={onClose} hitSlop={8}>
                        <X size={22} color={colors.schemes.light.onSurfaceVariant} />
                    </Pressable>
                </View>

                {/* Native iOS spinner wheel */}
                <DateTimePicker
                    value={pendingTime}
                    mode="time"
                    display="spinner"
                    onChange={(_, date) => { if (date) setPendingTime(date); }}
                    textColor={colors.schemes.light.onSurface}
                    style={{ backgroundColor: colors.schemes.light.background }}
                />

                {/* Confirm */}
                <View
                    style={{
                        padding: 16,
                        borderTopWidth: 1,
                        borderColor: colors.schemes.light.outlineVariant,
                    }}
                >
                    <Pressable
                        onPress={() => onConfirm(pendingTime)}
                        style={{
                            backgroundColor: colors.coreColors.primary,
                            borderRadius: borderRadius.base,
                            paddingVertical: 14,
                            alignItems: "center",
                        }}
                    >
                        <ThemedText
                            style={{
                                fontSize: fontSize.base,
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            Confirm
                        </ThemedText>
                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
    );
}
