import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AttendanceRecord } from '../types/attendance';
import { AttendanceEngine } from '../utils/attendanceEngine';
import { Typography, Layout, Shadows, useTheme } from './Theme';
import { ChevronRight } from 'lucide-react-native';

interface SubjectCardProps {
  record: AttendanceRecord;
  onPress: () => void;
}

export function SubjectCard({ record, onPress }: SubjectCardProps) {
  const theme = useTheme();
  const percentage = AttendanceEngine.calculatePercentage(record.attendedClasses, record.conductedClasses);
  const status = AttendanceEngine.calculateStatus(percentage, record.minimumAttendancePercentage);

  const getStatusColor = () => {
    switch (status) {
      case 'Excellent': return theme.moss;
      case 'Safe': return theme.moss; // We can use moss for both or amber for safe
      case 'Warning': return theme.amber;
      case 'Critical': return theme.clay;
      default: return theme.textSoft;
    }
  };

  const statusColor = getStatusColor();

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.surface }]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.code, { color: theme.textSoft }]}>{record.subjectCode}</Text>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{record.subjectName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <Text style={[styles.faculty, { color: theme.textSoft }]}>{record.facultyName} • Sem {record.semester}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.text }]}>{percentage.toFixed(1)}%</Text>
          <Text style={[styles.statLabel, { color: theme.textSoft }]}>Attendance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.text }]}>{record.attendedClasses}/{record.conductedClasses}</Text>
          <Text style={[styles.statLabel, { color: theme.textSoft }]}>Attended</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <View style={[styles.progressFill, { width: `${Math.min(100, percentage)}%`, backgroundColor: statusColor }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Shadows.lightSm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  code: {
    ...Typography.monoData,
    marginBottom: 2,
  },
  title: {
    ...Typography.cardTitle,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.pillRadius,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  faculty: {
    ...Typography.body,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
  },
  progressContainer: {
    width: '100%',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
