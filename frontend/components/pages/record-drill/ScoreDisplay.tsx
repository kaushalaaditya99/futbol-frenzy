import React from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { scoreToGrade, getScoreFeedback } from '@/utils/poseComparison';

interface ScoreDisplayProps {
    score: number | null;
    isVisible: boolean;
    showDetails?: boolean;
}

export function ScoreDisplay({ score, isVisible, showDetails = false }: ScoreDisplayProps) {
    if (!isVisible || score === null) return null;

    const { letter, color } = scoreToGrade(score);
    const feedback = getScoreFeedback(score);

    return (
        <View style={styles.container}>
            <View style={[styles.scoreCard, { borderColor: color }]}>
                <View style={styles.scoreRow}>
                    <Text style={[styles.gradeLetter, { color }]}>{letter}</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreNumber}>{score}</Text>
                        <Text style={styles.scoreMax}>/100</Text>
                    </View>
                </View>
                {showDetails && (
                    <Text style={styles.feedback}>{feedback}</Text>
                )}
            </View>
        </View>
    );
}

interface LiveScoreBadgeProps {
    score: number | null;
}

export function LiveScoreBadge({ score }: LiveScoreBadgeProps) {
    if (score === null) return null;

    const { letter, color } = scoreToGrade(score);

    return (
        <View style={[styles.badgeContainer, { backgroundColor: color }]}>
            <Text style={styles.badgeLetter}>{letter}</Text>
            <Text style={styles.badgeScore}>{score}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 120, // Above the controls
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    scoreCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        minWidth: 200,
        alignItems: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradeLetter: {
        fontSize: 48,
        fontWeight: 'bold',
        marginRight: 12,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreNumber: {
        fontSize: 36,
        fontWeight: '600',
        color: 'white',
    },
    scoreMax: {
        fontSize: 18,
        color: '#888',
        marginLeft: 4,
    },
    feedback: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 16,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeLetter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 6,
    },
    badgeScore: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
    },
});