export interface AttendanceRecord {
  id: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  semester: string;
  section: string;
  conductedClasses: number;
  attendedClasses: number;
  minimumAttendancePercentage: number;
  totalPlannedSemesterClasses: number;
  createdAt: number;
  updatedAt: number;
}

export type AttendanceStatus = 'Excellent' | 'Safe' | 'Warning' | 'Critical';
