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

export type UserRole = 'player' | 'coach' | 'admin';

export type User = {
    id: string;
    displayName: string;
    email: string;
    role: UserRole;
    teams: Record<string, UserRole>;
};

export type Team = {
    id: string;
    name: string;
};

export type TeamMember = {
    id: string;
    displayName: string;
    role: UserRole;
};

export type Message = {
    id: string;
    text: string;
    senderId: string;
    timestamp: number; // Using number (Date.now()) for simplicity
}

export type TeamWithMembers = Team & {
    members: TeamMember[];
};

export type Document = {
    id: string;
    fileName: string;
    url: string;
    teamId: string;
    category: string;
}
