import type { TeamEvent, User, Attendance } from './types';

export const mockUser: User = {
    id: 'user_123',
    displayName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'coach',
    teams: { 'team_senior_A': 'coach' }
};

const now = new Date();

export const mockEvents: TeamEvent[] = [
  {
    id: 'evt_1',
    title: 'Match vs. FC Sochaux',
    type: 'Match',
    startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    location: 'Stade Bonal, Sochaux',
    details: 'Rendez-vous au stade à 18h00. Maillot bleu.',
    teamId: 'team_senior_A',
  },
  {
    id: 'evt_2',
    title: 'Entraînement tactique',
    type: 'Entraînement',
    startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // in 4 days
    location: 'Stade René Viennet, Doubs',
    details: 'Session vidéo de 30 minutes avant l\'entraînement.',
    teamId: 'team_senior_A',
  },
  {
    id: 'evt_3',
    title: 'Réunion de début de saison',
    type: 'Réunion',
    startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // in 1 week
    location: 'Club House',
    teamId: 'team_senior_A',
  },
    {
    id: 'evt_4',
    title: 'Entraînement physique',
    type: 'Entraînement',
    startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // in 10 days
    location: 'Stade René Viennet, Doubs',
    details: 'Travail foncier et fractionné.',
    teamId: 'team_senior_A',
  },
];

export const mockAttendance: Record<string, Attendance[]> = {
    'evt_1': [
        { userId: 'user_1', userName: 'Alice Martin', status: 'present' },
        { userId: 'user_2', userName: 'Bob Durand', status: 'present' },
        { userId: 'user_3', userName: 'Charlie Petit', status: 'maybe' },
        { userId: 'user_4', userName: 'David Grand', status: 'absent' },
    ],
    'evt_2': [
        { userId: 'user_1', userName: 'Alice Martin', status: 'present' },
        { userId: 'user_2', userName: 'Bob Durand', status: 'maybe' },
    ],
    'evt_3': [],
    'evt_4': [],
};

// Mock functions to simulate fetching data
export const getEvents = async (): Promise<TeamEvent[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEvents.sort((a,b) => a.startTime.getTime() - b.startTime.getTime())), 500));
};

export const getEventById = async (id: string): Promise<TeamEvent | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEvents.find(e => e.id === id)), 300));
};

export const getAttendanceByEventId = async (eventId: string): Promise<Attendance[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockAttendance[eventId] || []), 300));
};
