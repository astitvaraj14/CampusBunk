import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Layout, Shadows, useTheme } from '@/components/Theme';
import { useAttendance } from '@/context/AttendanceContext';
import { AttendanceEngine } from '@/utils/attendanceEngine';
import { BarChart } from 'react-native-gifted-charts';
import React, { useState } from 'react';
import { X } from 'lucide-react-native';

export default function OverviewScreen() {
  const { records } = useAttendance();
  const theme = useTheme();

  const totalConducted = records.reduce((acc, r) => acc + r.conductedClasses, 0);
  const totalAttended = records.reduce((acc, r) => acc + r.attendedClasses, 0);
  
  const [isSkipsModalVisible, setIsSkipsModalVisible] = useState(false);
  const [isCriticalModalVisible, setIsCriticalModalVisible] = useState(false);

  let totalSafeSkips = 0;
  const subjectsWithSkips = records.map(r => {
    const skips = AttendanceEngine.safeClassesToSkip(r);
    totalSafeSkips += skips;
    return { ...r, skips };
  }).filter(r => r.skips > 0);

  const criticalSubjects = records.filter(r => AttendanceEngine.calculateStatus(
    AttendanceEngine.calculatePercentage(r.attendedClasses, r.conductedClasses), 
    r.minimumAttendancePercentage
  ) === 'Critical');
  const criticalCount = criticalSubjects.length;

  const barData = records.map(r => {
    const percentage = AttendanceEngine.calculatePercentage(r.attendedClasses, r.conductedClasses);
    return {
      value: percentage,
      label: r.subjectCode,
      frontColor: AttendanceEngine.calculateStatus(percentage, r.minimumAttendancePercentage) === 'Critical' ? theme.clay : theme.moss
    };
  });

  const STATS = [
    {
      id: 1,
      label: 'Safe Skips Available',
      value: totalSafeSkips.toString(),
      delta: 'Tap to view details',
      positive: true,
      onPress: () => setIsSkipsModalVisible(true)
    },
    {
      id: 2,
      label: 'Critical Subjects',
      value: criticalCount.toString(),
      delta: 'Tap to view details',
      positive: criticalCount === 0,
      onPress: () => setIsCriticalModalVisible(true)
    },
    {
      id: 3,
      label: 'Total Classes Conducted',
      value: totalConducted.toString(),
      delta: 'Semester total',
      positive: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[Typography.sectionNumber, { color: theme.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>Your detailed performance breakdown.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {records.length > 0 && (
          <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.text }]}>Subject Attendance</Text>
            <BarChart
              data={barData}
              barWidth={22}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{color: theme.textSoft, fontSize: 10}}
              noOfSections={4}
              maxValue={100}
              xAxisLabelTextStyle={{color: theme.textSoft, fontSize: 10}}
            />
          </View>
        )}

        {STATS.map((stat) => {
          const Wrapper = stat.onPress ? TouchableOpacity : View;
          return (
            <Wrapper 
              key={stat.id} 
              style={[styles.statPill, { backgroundColor: theme.surface }]}
              onPress={stat.onPress}
              activeOpacity={stat.onPress ? 0.7 : 1}
            >
              <View style={styles.statHeader}>
                <View style={[
                  styles.deltaBadge, 
                  { backgroundColor: stat.positive ? theme.moss : theme.clay }
                ]}>
                  <Text style={[styles.deltaText, { color: theme.background }]}>{stat.delta}</Text>
                </View>
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSoft }]}>{stat.label}</Text>
            </Wrapper>
          );
        })}
        {/* Extra space for the floating bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Safe Skips Modal */}
      <Modal
        visible={isSkipsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSkipsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Safe Skips Details</Text>
              <TouchableOpacity onPress={() => setIsSkipsModalVisible(false)}>
                <X size={24} color={theme.textSoft} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              {subjectsWithSkips.length === 0 ? (
                <View style={styles.modalEmpty}>
                  <Text style={[Typography.body, { color: theme.textSoft, textAlign: 'center' }]}>
                    You do not have any safe skips right now. Attend classes to build a buffer!
                  </Text>
                </View>
              ) : (
                subjectsWithSkips.map(subject => (
                  <View key={subject.id} style={[styles.skipItem, { backgroundColor: theme.surface }]}>
                    <View style={styles.skipItemLeft}>
                      <Text style={[styles.skipItemName, { color: theme.text }]} numberOfLines={1}>
                        {subject.subjectName}
                      </Text>
                      <Text style={[styles.skipItemCode, { color: theme.textSoft }]}>
                        {subject.subjectCode}
                      </Text>
                    </View>
                    <View style={[styles.skipBadge, { backgroundColor: theme.moss + '30' }]}>
                      <Text style={[styles.skipBadgeText, { color: theme.moss }]}>
                        {subject.skips} {subject.skips === 1 ? 'skip' : 'skips'}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Critical Subjects Modal */}
      <Modal
        visible={isCriticalModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCriticalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Critical Subjects</Text>
              <TouchableOpacity onPress={() => setIsCriticalModalVisible(false)}>
                <X size={24} color={theme.textSoft} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              {criticalSubjects.length === 0 ? (
                <View style={styles.modalEmpty}>
                  <Text style={[Typography.body, { color: theme.textSoft, textAlign: 'center' }]}>
                    Great job! You have no critical subjects right now.
                  </Text>
                </View>
              ) : (
                criticalSubjects.map(subject => {
                  const percentage = AttendanceEngine.calculatePercentage(subject.attendedClasses, subject.conductedClasses);
                  const deficit = AttendanceEngine.classesRequiredToReachMinimum(subject);
                  
                  return (
                    <View key={subject.id} style={[styles.skipItem, { backgroundColor: theme.surface }]}>
                      <View style={styles.skipItemLeft}>
                        <Text style={[styles.skipItemName, { color: theme.text }]} numberOfLines={1}>
                          {subject.subjectName}
                        </Text>
                        <Text style={[styles.skipItemCode, { color: theme.textSoft }]}>
                          {subject.subjectCode} • {percentage.toFixed(1)}%
                        </Text>
                      </View>
                      <View style={[styles.skipBadge, { backgroundColor: theme.clay + '30' }]}>
                        <Text style={[styles.skipBadgeText, { color: theme.clay }]}>
                          Attend {deficit}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Layout.padding,
    paddingTop: 20,
    paddingBottom: 24,
  },
  subtitle: {
    ...Typography.body,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: Layout.padding,
    gap: Layout.gap,
  },
  chartCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: Layout.gap,
    ...Shadows.darkMd,
  },
  chartTitle: {
    ...Typography.cardTitle,
    marginBottom: 20,
  },
  statPill: {
    borderRadius: 16,
    padding: 14,
    marginBottom: Layout.gap,
    ...Shadows.darkMd,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  deltaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.pillRadius,
  },
  deltaText: {
    ...Typography.caption,
  },
  statValue: {
    ...Typography.hero,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: Layout.padding,
  },
  modalContent: {
    borderRadius: 24,
    borderWidth: 1,
    maxHeight: '80%',
    padding: 24,
    ...Shadows.darkMd,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...Typography.sectionNumber,
    fontSize: 20,
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalEmpty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  skipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  skipItemLeft: {
    flex: 1,
    paddingRight: 12,
  },
  skipItemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  skipItemCode: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
  },
  skipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.pillRadius,
  },
  skipBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
