import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Layout, Shadows, useTheme } from '@/components/Theme';
import { useAttendance } from '@/context/AttendanceContext';
import { AttendanceEngine } from '@/utils/attendanceEngine';
import { SubjectCard } from '@/components/SubjectCard';
import { useRouter } from 'expo-router';
import { PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun } from 'lucide-react-native';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const { records } = useAttendance();
  const router = useRouter();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const toggleTheme = async () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newTheme);
    await AsyncStorage.setItem('theme-preference', newTheme);
  };

  // Calculations
  const totalConducted = records.reduce((acc, r) => acc + r.conductedClasses, 0);
  const totalAttended = records.reduce((acc, r) => acc + r.attendedClasses, 0);
  const overallPercentage = AttendanceEngine.calculatePercentage(totalAttended, totalConducted);

  const subjectsWithPercentages = records.map(r => ({
    ...r,
    percentage: AttendanceEngine.calculatePercentage(r.attendedClasses, r.conductedClasses)
  }));

  const highestSubject = [...subjectsWithPercentages].sort((a, b) => b.percentage - a.percentage)[0];
  const lowestSubject = [...subjectsWithPercentages].sort((a, b) => a.percentage - b.percentage)[0];
  const criticalSubjects = subjectsWithPercentages.filter(r => AttendanceEngine.calculateStatus(r.percentage, r.minimumAttendancePercentage) === 'Critical');

  const pieData = [
    { value: overallPercentage, color: theme.accent },
    { value: Math.max(0, 100 - overallPercentage), color: theme.border }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSoft }]}>Hello,</Text>
            <Text style={[Typography.sectionNumber, { color: theme.text }]}>Your Dashboard</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { backgroundColor: theme.surface }]}>
            {colorScheme === 'dark' ? (
              <Sun size={24} color={theme.text} />
            ) : (
              <Moon size={24} color={theme.text} />
            )}
          </TouchableOpacity>
        </View>

        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>Welcome to SmartAttend.</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSoft }]}>Head over to the Subjects tab to add your classes.</Text>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={theme.background === '#0F1115' ? ['#1E2229', '#14171C'] : ['#FFFFFF', '#F7F4EE']}
              style={styles.heroWidget}
            >
              <View style={styles.heroTextContainer}>
                <Text style={[styles.heroLabel, { color: theme.text }]}>Overall Attendance</Text>
                <Text style={[styles.heroValue, { color: theme.accent }]}>{overallPercentage.toFixed(1)}%</Text>
                <Text style={[styles.heroSubtext, { color: theme.textSoft }]}>
                  {totalAttended} / {totalConducted} Classes Attended
                </Text>
              </View>
              <View style={styles.chartContainer}>
                <PieChart
                  donut
                  radius={40}
                  innerRadius={30}
                  data={pieData}
                  centerLabelComponent={() => {
                    return <Text style={{ fontSize: 14, color: theme.text, fontFamily: 'Inter_600SemiBold' }}>{overallPercentage.toFixed(0)}%</Text>;
                  }}
                />
              </View>
            </LinearGradient>

            <View style={styles.statsRow}>
              <View style={[styles.miniStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.miniStatLabel, { color: theme.textSoft }]}>Highest</Text>
                <Text style={[styles.miniStatValue, { color: theme.text }]} numberOfLines={1}>{highestSubject?.subjectCode || '-'}</Text>
                <Text style={[styles.miniStatSub, { color: theme.textSoft }]}>{highestSubject ? highestSubject.percentage.toFixed(0) + '%' : '-'}</Text>
              </View>
              <View style={[styles.miniStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.miniStatLabel, { color: theme.textSoft }]}>Lowest</Text>
                <Text style={[styles.miniStatValue, { color: theme.clay }]} numberOfLines={1}>{lowestSubject?.subjectCode || '-'}</Text>
                <Text style={[styles.miniStatSub, { color: theme.clay }]}>{lowestSubject ? lowestSubject.percentage.toFixed(0) + '%' : '-'}</Text>
              </View>
              <View style={[styles.miniStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.miniStatLabel, { color: theme.textSoft }]}>Critical</Text>
                <Text style={[styles.miniStatValue, { color: theme.clay }]}>{criticalSubjects.length}</Text>
                <Text style={[styles.miniStatSub, { color: theme.clay }]}>Subjects</Text>
              </View>
            </View>

            {criticalSubjects.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Requires Attention</Text>
                {criticalSubjects.map(sub => (
                  <SubjectCard
                    key={sub.id}
                    record={sub}
                    onPress={() => router.push({ pathname: '/subject-modal', params: { id: sub.id } })}
                  />
                ))}
              </>
            )}

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Overview</Text>
            {records.slice(0, 2).map(sub => (
              <SubjectCard
                key={sub.id}
                record={sub}
                onPress={() => router.push({ pathname: '/subject-modal', params: { id: sub.id } })}
              />
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 10,
    borderRadius: 20,
  },
  greeting: {
    ...Typography.body,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: Layout.padding,
    gap: Layout.gap,
  },
  heroWidget: {
    flexDirection: 'row',
    borderRadius: Layout.cardRadius,
    padding: 20,
    ...Shadows.lightMd,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroLabel: {
    ...Typography.cardTitle,
    marginBottom: 8,
  },
  heroValue: {
    ...Typography.hero,
  },
  heroSubtext: {
    ...Typography.body,
    marginTop: 4,
  },
  chartContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    ...Shadows.lightSm,
  },
  miniStatLabel: {
    ...Typography.caption,
    marginBottom: 8,
  },
  miniStatValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    marginBottom: 4,
  },
  miniStatSub: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
  },
  sectionTitle: {
    ...Typography.cardTitle,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.cardTitle,
    marginBottom: 8,
  },
  emptySubtext: {
    ...Typography.body,
    textAlign: 'center',
  }
});
