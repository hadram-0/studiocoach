export type TeamEvent = {
  id: string;
  title: string;
  type: 'Match' | 'Entraînement' | 'Réunion' | 'Autre';
  startTime: Date;
  location: string;
  details?: string;
  teamId: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'maybe';

export type Attendance = {
  userId: string;
  userName: string;
  status: AttendanceStatus;
};

export type User = {
    id: string;
    displayName: string;
    email: string;
    role: 'player' | 'coach' | 'admin';
    teams: Record<string, 'player' | 'coach'>;
};
