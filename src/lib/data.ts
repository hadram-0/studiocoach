import type { TeamEvent, User, Attendance, Team, TeamMember } from './types';

export const mockUsers: User[] = [
    { id: 'user_coach', displayName: 'Coach Bob', email: 'coach@esdoubs.fr', role: 'coach', teams: { 'team_senior_A': 'coach' } },
    { id: 'user_player_1', displayName: 'Alice Martin', email: 'alice@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_2', displayName: 'Charlie Petit', email: 'charlie@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_3', displayName: 'David Grand', email: 'david@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_4', displayName: 'Eva Durand', email: 'eva@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_admin', displayName: 'Admin Gerome', email: 'admin@esdoubs.fr', role: 'admin', teams: { 'team_senior_A': 'admin' } },
];

// For simplicity, we'll use the first user as the "logged in" user. 
// In a real app, this would come from an auth context.
export const mockUser = mockUsers.find(u => u.role === 'coach')!;

export const mockTeams: Team[] = [
    { id: 'team_senior_A', name: 'Seniors A' },
];

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
        { userId: 'user_player_1', userName: 'Alice Martin', status: 'present' },
        { userId: 'user_player_2', userName: 'Charlie Petit', status: 'maybe' },
        { userId: 'user_player_3', userName: 'David Grand', status: 'absent' },
    ],
    'evt_2': [
        { userId: 'user_player_1', userName: 'Alice Martin', status: 'present' },
        { userId: 'user_player_2', userName: 'Charlie Petit', status: 'maybe' },
    ],
    'evt_3': [],
    'evt_4': [],
};

// --- Mock functions to simulate fetching data ---
export const getEvents = async (): Promise<TeamEvent[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEvents.sort((a,b) => a.startTime.getTime() - b.startTime.getTime())), 500));
};

export const getEventById = async (id: string): Promise<TeamEvent | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEvents.find(e => e.id === id)), 300));
};

export const getAttendanceByEventId = async (eventId: string): Promise<Attendance[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockAttendance[eventId] || []), 300));
};

export const getUserTeams = async (userId: string): Promise<Team[]> => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    const teamIds = Object.keys(user.teams);
    const teams = mockTeams.filter(t => teamIds.includes(t.id));
    return new Promise(resolve => setTimeout(() => resolve(teams), 200));
}

export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    const members = mockUsers
        .filter(u => u.teams[teamId])
        .map(u => ({
            id: u.id,
            displayName: u.displayName,
            role: u.teams[teamId]
        }));
    return new Promise(resolve => setTimeout(() => resolve(members), 200));
}