import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AttendanceRecord } from '../types/attendance';
import { StorageService } from '../services/storage';

interface AttendanceContextData {
  records: AttendanceRecord[];
  isLoading: boolean;
  addRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecord: (id: string, updates: Partial<Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextData | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const stored = await StorageService.getRecords();
      setRecords(stored);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecord = async (recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: Math.random().toString(36).substring(2, 15), // Temporary UUID fallback since 'uuid' needs polyfills in some Expo versions
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    await StorageService.saveRecords(updatedRecords);
  };

  const updateRecord = async (id: string, updates: Partial<Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updatedRecords = records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          ...updates,
          updatedAt: Date.now(),
        };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    await StorageService.saveRecords(updatedRecords);
  };

  const deleteRecord = async (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    await StorageService.saveRecords(updatedRecords);
  };

  const value = useMemo(() => ({
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord
  }), [records, isLoading]);

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
