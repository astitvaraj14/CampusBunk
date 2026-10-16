import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Layout, Shadows, useTheme } from '@/components/Theme';
import { useProfile } from '@/context/ProfileContext';
import { UserProfile } from '@/types/profile';
import { User, Mail, Phone, Calendar, Hash, BookOpen, GraduationCap, Edit2, Trash2 } from 'lucide-react-native';

const INITIAL_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  dob: '',
  mobileNumber: '',
  email: '',
  semester: '',
  usn: '',
  branch: ''
};

export default function ProfileScreen() {
  const theme = useTheme();
  const { profile, saveProfile, deleteProfile } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(INITIAL_PROFILE);

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData(profile);
    } else if (!profile && !isEditing) {
      // If there is no profile, default to edit mode immediately for a better UX
      setIsEditing(true);
    }
  }, [profile, isEditing]);

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.usn) {
      Alert.alert('Missing Info', 'First Name, Last Name, and USN are required.');
      return;
    }
    saveProfile(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Profile', 'Are you sure you want to delete your profile data? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          deleteProfile();
          setFormData(INITIAL_PROFILE);
          setIsEditing(true);
        }
      }
    ]);
  };

  if (isEditing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {profile ? 'Edit Profile' : 'Set Up Profile'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSoft }]}>
              Enter your student details below.
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>First Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.firstName}
                onChangeText={(t) => setFormData({ ...formData, firstName: t })}
                placeholder="John"
                placeholderTextColor={theme.textSoft}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Last Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.lastName}
                onChangeText={(t) => setFormData({ ...formData, lastName: t })}
                placeholder="Doe"
                placeholderTextColor={theme.textSoft}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>USN (University Seat Number) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.usn}
                onChangeText={(t) => setFormData({ ...formData, usn: t.toUpperCase() })}
                placeholder="1AB23CS001"
                placeholderTextColor={theme.textSoft}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Date of Birth</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.dob}
                onChangeText={(t) => setFormData({ ...formData, dob: t })}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.textSoft}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
                placeholder="john.doe@college.edu"
                placeholderTextColor={theme.textSoft}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Mobile Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={formData.mobileNumber}
                onChangeText={(t) => setFormData({ ...formData, mobileNumber: t })}
                placeholder="+1 234 567 8900"
                placeholderTextColor={theme.textSoft}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: theme.text }]}>Semester</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.semester}
                  onChangeText={(t) => setFormData({ ...formData, semester: t })}
                  placeholder="e.g. 5th"
                  placeholderTextColor={theme.textSoft}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: theme.text }]}>Branch/Course</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                  value={formData.branch}
                  onChangeText={(t) => setFormData({ ...formData, branch: t })}
                  placeholder="e.g. CSE"
                  placeholderTextColor={theme.textSoft}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              {profile && (
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, { borderColor: theme.border }]} 
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.button, styles.saveButton, { backgroundColor: theme.accent, flex: profile ? 2 : 1 }]} 
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Details</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // VIEW MODE
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[Typography.sectionNumber, { color: theme.text }]}>Student Profile</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.iconButton, { backgroundColor: theme.surface }]}>
              <Edit2 size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={[styles.iconButton, { backgroundColor: theme.surface, marginLeft: 12 }]}>
              <Trash2 size={20} color={theme.clay} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.idCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.accent + '20' }]}>
            <Text style={[styles.avatarText, { color: theme.accent }]}>
              {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: theme.text }]}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={[styles.profileUsn, { color: theme.textSoft }]}>{profile?.usn}</Text>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <GraduationCap size={18} color={theme.textSoft} style={styles.infoIcon} />
              <View>
                <Text style={[styles.infoLabel, { color: theme.textSoft }]}>Branch</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{profile?.branch || '-'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <BookOpen size={18} color={theme.textSoft} style={styles.infoIcon} />
              <View>
                <Text style={[styles.infoLabel, { color: theme.textSoft }]}>Semester</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{profile?.semester || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Mail size={18} color={theme.textSoft} style={styles.infoIcon} />
              <View>
                <Text style={[styles.infoLabel, { color: theme.textSoft }]}>Email</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{profile?.email || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Phone size={18} color={theme.textSoft} style={styles.infoIcon} />
              <View>
                <Text style={[styles.infoLabel, { color: theme.textSoft }]}>Mobile</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{profile?.mobileNumber || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Calendar size={18} color={theme.textSoft} style={styles.infoIcon} />
              <View>
                <Text style={[styles.infoLabel, { color: theme.textSoft }]}>DOB</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{profile?.dob || '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    ...Typography.sectionNumber,
    marginTop: 20,
  },
  headerSubtitle: {
    ...Typography.body,
    marginBottom: 24,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lightSm,
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    marginRight: 12,
  },
  saveButton: {
    ...Shadows.darkMd,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  idCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    ...Shadows.lightMd,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 32,
  },
  profileName: {
    ...Typography.cardTitle,
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  profileUsn: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  infoGrid: {
    width: '100%',
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  }
});
