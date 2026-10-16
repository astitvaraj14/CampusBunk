import { AttendanceRecord, AttendanceStatus } from '../types/attendance';

export const AttendanceEngine = {
  // 1. Current Attendance Percentage
  calculatePercentage: (attended: number, conducted: number): number => {
    if (conducted === 0) return 100; // If no classes, you have 100% implicitly
    return (attended / conducted) * 100;
  },

  // 2. Attendance Status
  calculateStatus: (
    percentage: number,
    minimumAttendance: number
  ): AttendanceStatus => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= minimumAttendance) return 'Safe';
    if (percentage >= minimumAttendance - 5) return 'Warning';
    return 'Critical';
  },

  // 3. Classes Required to Reach Minimum Attendance
  classesRequiredToReachMinimum: (record: AttendanceRecord): number => {
    const { attendedClasses, conductedClasses, minimumAttendancePercentage } = record;
    let required = 0;
    let tempAttended = attendedClasses;
    let tempConducted = conductedClasses;
    
    let currentPercentage = AttendanceEngine.calculatePercentage(tempAttended, tempConducted);
    
    while (currentPercentage < minimumAttendancePercentage) {
      required++;
      tempAttended++;
      tempConducted++;
      currentPercentage = AttendanceEngine.calculatePercentage(tempAttended, tempConducted);
      
      // Safety break to prevent infinite loops for impossible cases
      if (required > 1000) break;
    }
    
    return required;
  },

  // 4. Bunk Calculator (Future classes that can be skipped)
  safeClassesToSkip: (record: AttendanceRecord): number => {
    const { attendedClasses, conductedClasses, minimumAttendancePercentage } = record;
    let safeToSkip = 0;
    let tempConducted = conductedClasses;

    let currentPercentage = AttendanceEngine.calculatePercentage(attendedClasses, tempConducted);
    
    // Check if we skip one more class, will we still be above minimum?
    while (true) {
      const nextPercentage = AttendanceEngine.calculatePercentage(attendedClasses, tempConducted + 1);
      if (nextPercentage >= minimumAttendancePercentage) {
        safeToSkip++;
        tempConducted++;
      } else {
        break;
      }
      
      if (safeToSkip > 1000) break; // safety
    }
    
    return safeToSkip;
  },

  // 5. Semester Skip Calculator
  semesterSkipCalculator: (record: AttendanceRecord) => {
    const { attendedClasses, conductedClasses, totalPlannedSemesterClasses, minimumAttendancePercentage } = record;
    const remainingClasses = Math.max(0, totalPlannedSemesterClasses - conductedClasses);
    
    // We want: ((attendedClasses + x) / totalPlannedSemesterClasses) * 100 >= minimumAttendancePercentage
    // x is the number of remaining classes we MUST attend.
    // Minimum classes to attend total = ceil(totalPlannedSemesterClasses * minimumAttendancePercentage / 100)
    const requiredTotalAttended = Math.ceil((totalPlannedSemesterClasses * minimumAttendancePercentage) / 100);
    const mustAttendRemaining = Math.max(0, requiredTotalAttended - attendedClasses);
    
    const maxFutureMisses = Math.max(0, remainingClasses - mustAttendRemaining);
    
    return {
      remainingClasses,
      maxFutureMisses
    };
  },

  // 6. Attendance Prediction Engine
  predictAttendance: (record: AttendanceRecord, scenario: 'attendN' | 'missN' | 'alternate' | 'attendAll' | 'missAll', n: number = 0): number => {
    let { attendedClasses, conductedClasses, totalPlannedSemesterClasses } = record;
    const remainingClasses = Math.max(0, totalPlannedSemesterClasses - conductedClasses);
    
    switch (scenario) {
      case 'attendN':
        return AttendanceEngine.calculatePercentage(attendedClasses + n, conductedClasses + n);
      case 'missN':
        return AttendanceEngine.calculatePercentage(attendedClasses, conductedClasses + n);
      case 'alternate':
        const attendHalf = Math.ceil(n / 2);
        return AttendanceEngine.calculatePercentage(attendedClasses + attendHalf, conductedClasses + n);
      case 'attendAll':
        return AttendanceEngine.calculatePercentage(attendedClasses + remainingClasses, totalPlannedSemesterClasses);
      case 'missAll':
        return AttendanceEngine.calculatePercentage(attendedClasses, totalPlannedSemesterClasses);
      default:
        return AttendanceEngine.calculatePercentage(attendedClasses, conductedClasses);
    }
  }
};
