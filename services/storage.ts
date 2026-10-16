import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceRecord } from '../types/attendance';
import { UserProfile } from '../types/profile';

const STORAGE_KEY = '@pace_attendance_records';
const PROFILE_KEY = '@smartattend_profile';

export const StorageService = {
  // CREATE & UPDATE
  saveRecords: async (records: AttendanceRecord[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(records);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save records to AsyncStorage', e);
      throw e;
    }
  },

  // READ
  getRecords: async (): Promise<AttendanceRecord[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to fetch records from AsyncStorage', e);
      throw e;
    }
  },

  // DELETE
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear AsyncStorage', e);
      throw e;
    }
  },

  // PROFILE METHODS
  saveProfile: async (profile: UserProfile): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(PROFILE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save profile to AsyncStorage', e);
      throw e;
    }
  },

  getProfile: async (): Promise<UserProfile | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch profile from AsyncStorage', e);
      throw e;
    }
  },

  deleteProfile: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (e) {
      console.error('Failed to delete profile from AsyncStorage', e);
      throw e;
    }
  }
};
