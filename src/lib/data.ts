import type { TeamEvent, User, Attendance, Team, TeamMember, Message } from './types';

// --- USERS ---
export const mockUsers: User[] = [
    { id: 'user_coach', displayName: 'Coach Bob', email: 'coach@esdoubs.fr', role: 'coach', teams: { 'team_senior_A': 'coach' } },
    { id: 'user_player_1', displayName: 'Alice Martin', email: 'alice@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_2', displayName: 'Charlie Petit', email: 'charlie@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_3', displayName: 'David Grand', email: 'david@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_player_4', displayName: 'Eva Durand', email: 'eva@esdoubs.fr', role: 'player', teams: { 'team_senior_A': 'player' } },
    { id: 'user_admin', displayName: 'Admin Gerome', email: 'admin@esdoubs.fr', role: 'admin', teams: { 'team_senior_A': 'admin' } },
];

export const mockUser = mockUsers.find(u => u.id === 'user_coach')!;


// --- TEAMS ---
export const mockTeams: Team[] = [
    { id: 'team_senior_A', name: 'Seniors A' },
];


// --- EVENTS ---
const now = new Date();
export const mockEvents: TeamEvent[] = [
  { id: 'evt_1', title: 'Match vs. FC Sochaux', type: 'Match', startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), location: 'Stade Bonal, Sochaux', details: 'Rendez-vous au stade à 18h00. Maillot bleu.', teamId: 'team_senior_A' },
  { id: 'evt_2', title: 'Entraînement tactique', type: 'Entraînement', startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), location: 'Stade René Viennet, Doubs', details: 'Session vidéo de 30 minutes avant l\'entraînement.', teamId: 'team_senior_A' },
  { id: 'evt_3', title: 'Réunion de début de saison', type: 'Réunion', startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), location: 'Club House', teamId: 'team_senior_A' },
  { id: 'evt_4', title: 'Entraînement physique', type: 'Entraînement', startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), location: 'Stade René Viennet, Doubs', details: 'Travail foncier et fractionné.', teamId: 'team_senior_A' },
];

// --- ATTENDANCE ---
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
    'evt_3': [], 'evt_4': [],
};


// --- CHAT ---
const mockMessages: Record<string, Message[]> = {
    'team_senior_A': [
        { id: 'msg_1', text: 'Salut tout le monde, n\'oubliez pas vos gourdes pour demain !', senderId: 'user_coach', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
        { id: 'msg_2', text: 'Bien reçu coach !', senderId: 'user_player_1', timestamp: Date.now() - 1.5 * 60 * 60 * 1000 },
        { id: 'msg_3', text: 'Ok pour moi 👍', senderId: 'user_player_2', timestamp: Date.now() - 1 * 60 * 60 * 1000 },
    ]
}
const messageListeners: Record<string, ((message: Message) => void)[]> = {};


// --- MOCK API FUNCTIONS ---

// EVENTS
export const getEvents = async (): Promise<TeamEvent[]> => Promise.resolve(mockEvents.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()));
export const getEventById = async (id: string): Promise<TeamEvent | undefined> => Promise.resolve(mockEvents.find(e => e.id === id));

// ATTENDANCE
export const getAttendanceByEventId = async (eventId: string): Promise<Attendance[]> => Promise.resolve(mockAttendance[eventId] || []);

// TEAMS
export const getUserTeams = async (userId: string): Promise<Team[]> => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    const teamIds = Object.keys(user.teams);
    return Promise.resolve(mockTeams.filter(t => teamIds.includes(t.id)));
}
export const getTeamById = async (teamId: string): Promise<Team | undefined> => Promise.resolve(mockTeams.find(t => t.id === teamId));
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    return Promise.resolve(mockUsers
        .filter(u => u.teams[teamId])
        .map(u => ({ id: u.id, displayName: u.displayName, role: u.teams[teamId] }))
    );
}

// CHAT
export const getChatMessages = async (teamId: string): Promise<Message[]> => Promise.resolve(mockMessages[teamId] || []);

export const sendMessage = (teamId: string, text: string) => {
    const newMessage: Message = {
        id: `msg_${Date.now()}`,
        text,
        senderId: mockUser.id,
        timestamp: Date.now()
    };
    if (!mockMessages[teamId]) mockMessages[teamId] = [];
    mockMessages[teamId].push(newMessage);

    // Notify listeners
    if (messageListeners[teamId]) {
        messageListeners[teamId].forEach(callback => callback(newMessage));
    }
};

export const onNewMessage = (teamId: string, callback: (message: Message) => void): (() => void) => {
    if (!messageListeners[teamId]) {
        messageListeners[teamId] = [];
    }
    messageListeners[teamId].push(callback);

    // Return an unsubscribe function
    return () => {
        messageListeners[teamId] = messageListeners[teamId].filter(cb => cb !== callback);
    };
};
