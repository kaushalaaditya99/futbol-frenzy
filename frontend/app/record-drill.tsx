import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecordDrillScreen } from '@/components/pages/record-drill/RecordDrillScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import resolveEndpoint from '@/services/resolveEndpoint';
import { MoveLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface DrillData {
    id: number;
    drillName: string;
    url: string;
    instructions: string;
    difficultyLevel: string;
}

export default function RecordDrillRoute() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [drill, setDrill] = useState<DrillData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get drill ID and assignment ID from route params
    const drillId = parseInt(params.drillId as string, 10) || 1;
    const assignmentId = parseInt(params.assignmentId as string, 10) || 1;
    const returnTo = params.returnTo as string | undefined;
    console.log("[RecordDrill] Route params - drillId:", drillId, "assignmentId:", assignmentId);

    // Fetch drill data
    useEffect(() => {
        const fetchDrill = async () => {
            try {
                setIsLoading(true);
                const token = await AsyncStorage.getItem('authToken');

                const response = await axios.get(
                    resolveEndpoint(`/api/drills/${drillId}/`),
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                setDrill(response.data);
                console.log("[RecordDrill] Fetched drill - id:", response.data.id, "name:", response.data.drillName);
            } catch (err: any) {
                console.error('Failed to fetch drill:', err);
                setError('Failed to load drill data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrill();
    }, [drillId]);

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <MoveLeft size={24} color="white" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Record Drill</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00FF88" />
                    <Text style={styles.loadingText}>Loading drill...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Error state
    if (error || !drill) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <MoveLeft size={24} color="white" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Record Drill</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error || 'Drill not found'}</Text>
                    <Pressable style={styles.retryButton} onPress={() => router.back()}>
                        <Text style={styles.retryText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/assignments/${assignmentId}');
                        }
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MoveLeft size={24} color="white" />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {drill.drillName}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Main recording screen */}
            <RecordDrillScreen
                drillId={drill.id}
                drillName={drill.drillName}
                instructorVideoUrl={drill.url}
                assignmentId={assignmentId}
                returnToAssignment={returnTo === 'assignment'}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'black',
        zIndex: 100,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#00FF88',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: 'black',
        fontWeight: '600',
        fontSize: 16,
    },
});