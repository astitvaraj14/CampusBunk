import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Typography, Layout, Shadows, useTheme } from '@/components/Theme';
import { useAttendance } from '@/context/AttendanceContext';
import { SubjectCard } from '@/components/SubjectCard';
import { Plus, Search, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AttendanceEngine } from '@/utils/attendanceEngine';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubjectsScreen() {
  const { records } = useAttendance();
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Critical', 'Warning', 'Safe', 'Excellent'];

  const filteredRecords = records.filter(record => {
    // Search match
    const searchMatch = 
      record.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      record.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!searchMatch) return false;

    // Filter match
    if (activeFilter === 'All') return true;
    
    const percentage = AttendanceEngine.calculatePercentage(record.attendedClasses, record.conductedClasses);
    const status = AttendanceEngine.calculateStatus(percentage, record.minimumAttendancePercentage);
    
    return status === activeFilter;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[Typography.sectionNumber, { color: theme.text }]}>Subjects</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Search size={20} color={theme.textSoft} />
          <TextInput 
            style={[styles.searchInput, { color: theme.text }]} 
            placeholder="Search subjects..." 
            placeholderTextColor={theme.textSoft}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: Layout.padding }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.filterChip, 
                { backgroundColor: theme.border },
                activeFilter === item && { backgroundColor: theme.text }
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[
                styles.filterText,
                { color: theme.textSoft },
                activeFilter === item && { color: theme.background }
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredRecords}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SubjectCard 
            record={item} 
            onPress={() => router.push({ pathname: '/subject-modal', params: { id: item.id } })} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>No subjects found.</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSoft }]}>Tap the + button to add one.</Text>
          </View>
        }
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.accent }]} onPress={() => router.push('/subject-modal')}>
        <Plus size={24} color={'#FFFFFF'} />
      </TouchableOpacity>
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
    paddingBottom: 16,
  },
  searchContainer: {
    paddingHorizontal: Layout.padding,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Layout.pillRadius,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    ...Typography.body,
  },
  filtersContainer: {
    marginBottom: 16,
    height: 36,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.pillRadius,
    marginRight: 8,
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: Layout.padding,
    paddingBottom: 120, // space for fab and bottom tab bar
    gap: Layout.gap,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...Typography.cardTitle,
    marginBottom: 4,
  },
  emptySubtext: {
    ...Typography.body,
  },
  fab: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.amberGlow,
  }
});
