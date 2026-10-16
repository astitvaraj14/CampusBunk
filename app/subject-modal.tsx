import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography, Layout, Shadows, useTheme } from '@/components/Theme';
import { useAttendance } from '@/context/AttendanceContext';
import { AttendanceRecord } from '@/types/attendance';

export default function SubjectModal() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { records, addRecord, updateRecord, deleteRecord } = useAttendance();

  const isEditing = !!id;
  const existingRecord = isEditing ? records.find(r => r.id === id) : null;

  const [subjectName, setSubjectName] = useState(existingRecord?.subjectName || '');
  const [subjectCode, setSubjectCode] = useState(existingRecord?.subjectCode || '');
  const [facultyName, setFacultyName] = useState(existingRecord?.facultyName || '');
  const [semester, setSemester] = useState(existingRecord?.semester || '');
  const [section, setSection] = useState(existingRecord?.section || '');
  const [conductedClasses, setConductedClasses] = useState(existingRecord?.conductedClasses.toString() || '0');
  const [attendedClasses, setAttendedClasses] = useState(existingRecord?.attendedClasses.toString() || '0');
  const [minimumAttendance, setMinimumAttendance] = useState(existingRecord?.minimumAttendancePercentage.toString() || '75');
  const [totalPlanned, setTotalPlanned] = useState(existingRecord?.totalPlannedSemesterClasses.toString() || '40');

  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!subjectName) newErrors.push('Subject Name is required');
    if (!subjectCode) newErrors.push('Subject Code is required');
    if (!facultyName) newErrors.push('Faculty Name is required');
    if (!semester) newErrors.push('Semester is required');
    
    const conducted = parseInt(conductedClasses);
    const attended = parseInt(attendedClasses);
    const total = parseInt(totalPlanned);
    const minAtt = parseInt(minimumAttendance);

    if (isNaN(conducted) || conducted < 0) newErrors.push('Conducted Classes must be >= 0');
    if (isNaN(attended) || attended < 0) newErrors.push('Attended Classes must be >= 0');
    if (attended > conducted) newErrors.push('Attended Classes cannot exceed Conducted Classes');
    if (conducted > total) newErrors.push('Conducted Classes cannot exceed Total Planned');
    if (isNaN(minAtt) || minAtt < 0 || minAtt > 100) newErrors.push('Minimum Attendance must be between 0 and 100');
    if (isNaN(total) || total <= 0) newErrors.push('Total Planned Classes must be > 0');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const recordData = {
      subjectName,
      subjectCode,
      facultyName,
      semester,
      section,
      conductedClasses: parseInt(conductedClasses),
      attendedClasses: parseInt(attendedClasses),
      minimumAttendancePercentage: parseInt(minimumAttendance),
      totalPlannedSemesterClasses: parseInt(totalPlanned),
    };

    if (isEditing && id) {
      await updateRecord(id, recordData);
    } else {
      await addRecord(recordData);
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subject',
      'Are you sure you want to delete this subject? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deleteRecord(id);
              router.back();
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.text }]}>{isEditing ? 'Edit Subject' : 'Add Subject'}</Text>
      
      {errors.length > 0 && (
        <View style={[styles.errorContainer, { backgroundColor: theme.clay + '20' }]}>
          {errors.map((err, i) => <Text key={i} style={[styles.errorText, { color: theme.clay }]}>• {err}</Text>)}
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Subject Name</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={subjectName} onChangeText={setSubjectName} placeholder="e.g. Data Structures" placeholderTextColor={theme.textSoft} />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Subject Code</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={subjectCode} onChangeText={setSubjectCode} placeholder="CS101" placeholderTextColor={theme.textSoft} />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Semester</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={semester} onChangeText={setSemester} placeholder="4" placeholderTextColor={theme.textSoft} keyboardType="default" />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Faculty Name</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={facultyName} onChangeText={setFacultyName} placeholder="Dr. Smith" placeholderTextColor={theme.textSoft} />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Conducted</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={conductedClasses} onChangeText={setConductedClasses} keyboardType="numeric" />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Attended</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={attendedClasses} onChangeText={setAttendedClasses} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Min Attendance %</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={minimumAttendance} onChangeText={setMinimumAttendance} keyboardType="numeric" />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: theme.text }]}>Total Planned</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={totalPlanned} onChangeText={setTotalPlanned} keyboardType="numeric" />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>Save Subject</Text>
        </TouchableOpacity>
        
        {isEditing && (
          <TouchableOpacity style={[styles.deleteButton, { borderColor: theme.clay }]} onPress={handleDelete}>
            <Text style={[styles.deleteButtonText, { color: theme.clay }]}>Delete Subject</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Layout.padding,
    paddingBottom: 40,
  },
  title: {
    ...Typography.sectionNumber,
    marginBottom: 20,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    ...Typography.body,
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    ...Typography.cardTitle,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Typography.body,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    borderRadius: Layout.pillRadius,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadows.amberGlow,
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: Layout.pillRadius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
