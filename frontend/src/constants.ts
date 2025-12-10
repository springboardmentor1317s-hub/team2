import { Event, User, UserRole, Registration, AdminLog } from './types';

// Helper to generate dynamic dates
const getTodayDate = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const getFutureDate2026 = (month: number, day: number) => {
  return new Date(2026, month, day, 10, 0, 0).toISOString();
};

const getRelativeDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@university.edu',
    college: 'Tech University',
    role: UserRole.STUDENT,
    password: 'password123',
    lastActive: '2 hours ago',
    status: 'Active'
  },
  {
    id: 'u2',
    name: 'Sarah Wilson',
    email: 'sarah@university.edu',
    college: 'Arts College',
    role: UserRole.COLLEGE_ADMIN,
    password: 'password123',
    lastActive: '1 day ago',
    status: 'Active'
  },
  {
    id: 'u3',
    name: 'Dr. Michael Johnson',
    email: 'admin@university.edu',
    role: UserRole.SUPER_ADMIN,
    password: 'password123',
    lastActive: 'Just now',
    status: 'Active'
  },
  {
    id: 'u4',
    name: 'Emily Chen',
    email: 'emily@tech.edu',
    college: 'Tech University',
    role: UserRole.STUDENT,
    password: 'password123',
    lastActive: '5 hours ago',
    status: 'Inactive'
  },
  {
    id: 'u5',
    name: 'Robert Brown',
    email: 'robert@sports.edu',
    college: 'Sports University',
    role: UserRole.COLLEGE_ADMIN,
    password: 'password123',
    lastActive: '3 days ago',
    status: 'Active'
  }
];

export const MOCK_EVENTS: Event[] = [
  // --- 3 EVENTS TODAY ---
  {
    id: 'e1',
    collegeId: 'c1',
    title: 'Inter-College Hackathon 2025',
    description: 'A 48-hour coding marathon bringing together the brightest minds to solve real-world problems. Happening right now!',
    category: 'hackathon',
    location: 'Tech University Main Campus',
    startDate: getTodayDate(15), // Today 9 AM
    endDate: getTodayDate(21),  // Today 9 PM
    status: 'ongoing',
    tags: ['coding', 'innovation', 'today'],
    imageUrl: 'https://picsum.photos/seed/hackathon/800/400',
    participantsCount: 127,
    maxParticipants: 200,
    createdAt: '2024-01-15T00:00:00'
  },
  {
    id: 'e2',
    collegeId: 'c2',
    title: 'Cultural Fest - Harmony',
    description: 'Celebrate diversity and creativity through music, dance, and art. Join us today!',
    category: 'cultural',
    location: 'City Cultural Center',
    startDate: getTodayDate(10), // Today 10 AM
    endDate: getTodayDate(18),   // Today 6 PM
    status: 'ongoing',
    tags: ['music', 'dance', 'art', 'today'],
    imageUrl: 'https://picsum.photos/seed/cultural/800/400',
    participantsCount: 342,
    maxParticipants: 500,
    createdAt: '2024-01-20T00:00:00'
  },
  {
    id: 'e3',
    collegeId: 'c3',
    title: 'Basketball Championship Finals',
    description: 'The final showdown happening today. Don\'t miss the action at the arena.',
    category: 'sports',
    location: 'Sports University Arena',
    startDate: getTodayDate(14), //  2 PM
    endDate: getTodayDate(17),   //  5 PM
    status: 'ongoing',
    tags: ['sports', 'competition', 'fitness', 'Future'],
    imageUrl: 'https://picsum.photos/seed/basketball/800/400',
    participantsCount: 160,
    maxParticipants: 160,
    createdAt: '2023-12-10T00:00:00'
  },

  // --- 4 EVENTS IN 2026 (UPCOMING) ---
  {
    id: 'e4',
    collegeId: 'c1',
    title: 'Future Web Summit 2026',
    description: 'A look into the future of web technologies. Early bird registrations open for 2026.',
    category: 'workshop',
    location: 'Tech University Lab 3',
    startDate: getFutureDate2026(2, 10), // March 10, 2026
    endDate: getFutureDate2026(2, 12),
    status: 'upcoming',
    tags: ['learning', 'web', 'future'],
    imageUrl: 'https://picsum.photos/seed/workshop/800/400',
    participantsCount: 45,
    maxParticipants: 50,
    createdAt: '2024-02-01T00:00:00'
  },
  {
    id: 'e5',
    collegeId: 'c1',
    title: 'Mars Colonization Expo 2026',
    description: 'Showcasing the roadmap to Mars. Innovation and aerospace exhibition.',
    category: 'other',
    location: 'Innovation Hall',
    startDate: getFutureDate2026(5, 15), // June 15, 2026
    endDate: getFutureDate2026(5, 20),
    status: 'upcoming',
    tags: ['space', 'tech', 'future'],
    imageUrl: 'https://picsum.photos/seed/techexpo/800/400',
    participantsCount: 200,
    maxParticipants: 500,
    createdAt: '2024-02-10T10:00:00'
  },
  {
    id: 'e6',
    collegeId: 'c2',
    title: 'Global Debate Championship 2026',
    description: 'Universities from around the world gather for the ultimate debate league.',
    category: 'cultural',
    location: 'Arts College Auditorium',
    startDate: getFutureDate2026(8, 1), // Sept 1, 2026
    endDate: getFutureDate2026(8, 5),
    status: 'upcoming',
    tags: ['debate', 'global', 'politics'],
    imageUrl: 'https://picsum.photos/seed/debate/800/400',
    participantsCount: 64,
    maxParticipants: 100,
    createdAt: '2024-02-15T09:00:00'
  },
  {
    id: 'e7',
    collegeId: 'c3',
    title: 'RoboWars World Cup 2026',
    description: 'The biggest robotics event of the decade. Prepare your bots.',
    category: 'hackathon',
    location: 'Tech University Indoor Stadium',
    startDate: getFutureDate2026(10, 25), // Nov 25, 2026
    endDate: getFutureDate2026(10, 28),
    status: 'upcoming',
    tags: ['robotics', 'engineering', '2026'],
    imageUrl: 'https://picsum.photos/seed/robowars/800/400',
    participantsCount: 60,
    maxParticipants: 100,
    createdAt: '2024-02-25T00:00:00'
  },

  // --- 4 EVENTS ONGOING (Started Yesterday, Ends Tomorrow) ---
  {
    id: 'e8',
    collegeId: 'c2',
    title: 'Literature Week',
    description: 'A week-long celebration of poetry and literature. Currently in progress.',
    category: 'cultural',
    location: 'Arts College Library',
    startDate: getRelativeDate(-1), // Yesterday
    endDate: getRelativeDate(2),    // Day after tomorrow
    status: 'ongoing',
    tags: ['literature', 'poetry', 'reading'],
    imageUrl: 'https://picsum.photos/seed/poetry/800/400',
    participantsCount: 85,
    maxParticipants: 150,
    createdAt: '2024-03-01T00:00:00'
  },
  {
    id: 'e9',
    collegeId: 'c3',
    title: 'Spring Sports Carnival',
    description: 'Multi-sport event happening all week at the complex.',
    category: 'sports',
    location: 'University Sports Complex',
    startDate: getRelativeDate(-2), // 2 days ago
    endDate: getRelativeDate(3),    // 3 days from now
    status: 'ongoing',
    tags: ['fitness', 'marathon', 'sports'],
    imageUrl: 'https://picsum.photos/seed/marathon/800/400',
    participantsCount: 300,
    maxParticipants: 1000,
    createdAt: '2024-03-05T00:00:00'
  },
  {
    id: 'e10',
    collegeId: 'c2',
    title: 'AI Art & Design Week',
    description: 'Interactive workshops on Generative AI. Walk-ins welcome while it lasts.',
    category: 'workshop',
    location: 'Design Studio B',
    startDate: getRelativeDate(-1), // Yesterday
    endDate: getRelativeDate(1),    // Tomorrow
    status: 'ongoing',
    tags: ['AI', 'art', 'design'],
    imageUrl: 'https://picsum.photos/seed/aiart/800/400',
    participantsCount: 30,
    maxParticipants: 50,
    createdAt: '2024-03-10T14:00:00'
  },
  {
    id: 'e11',
    collegeId: 'c1',
    title: 'Campus Gaming League',
    description: 'The servers are live! Join the ongoing LAN party at the student center.',
    category: 'sports',
    location: 'Student Center',
    startDate: getRelativeDate(-1), // Yesterday
    endDate: getRelativeDate(1),    // Tomorrow
    status: 'ongoing',
    tags: ['gaming', 'esports', 'lan'],
    imageUrl: 'https://picsum.photos/seed/gaming/800/400',
    participantsCount: 150,
    maxParticipants: 200,
    createdAt: '2024-03-12T00:00:00'
  }
];

export const MOCK_REGISTRATIONS: Registration[] = [
  { id: 'r1', eventId: 'e1', userId: 'u1', status: 'approved', timestamp: '2024-01-15T10:30:00' },
  { id: 'r2', eventId: 'e2', userId: 'u1', status: 'pending', timestamp: '2024-01-16T14:20:00' },
  { id: 'r3', eventId: 'e1', userId: 'u4', status: 'pending', timestamp: '2024-01-17T09:15:00' },
  { id: 'r4', eventId: 'e3', userId: 'u1', status: 'approved', timestamp: '2024-01-10T11:00:00' },
  { id: 'r5', eventId: 'e7', userId: 'u4', status: 'pending', timestamp: '2024-03-01T09:00:00' },
  { id: 'r6', eventId: 'e5', userId: 'u1', status: 'approved', timestamp: '2024-03-15T12:00:00' }
];

export const MOCK_ADMIN_LOGS: AdminLog[] = [
  { id: 'l1', action: 'User Approval', userId: 'u3', targetId: 'u2', details: 'Approved College Admin registration', timestamp: '2024-02-01T10:00:00' },
  { id: 'l2', action: 'Event Flagged', userId: 'u3', targetId: 'e1', details: 'Flagged for content review', timestamp: '2024-02-02T14:30:00' },
  { id: 'l3', action: 'Settings Update', userId: 'u3', details: 'Updated global security settings', timestamp: '2024-02-03T09:15:00' },
  { id: 'l4', action: 'User Ban', userId: 'u3', targetId: 'u4', details: 'Banned user for violating guidelines', timestamp: '2024-02-04T16:20:00' }
];
