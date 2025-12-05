import { Event, User, UserRole, Registration, AdminLog } from './types';

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
  {
    id: 'e1',
    collegeId: 'c1',
    title: 'Inter-College Hackathon 2024',
    description: 'A 48-hour coding marathon bringing together the brightest minds from various colleges to solve real-world problems. Join us for innovation, networking, and prizes.',
    category: 'hackathon',
    location: 'Tech University Main Campus',
    startDate: '2024-02-15T09:00:00',
    endDate: '2024-02-17T09:00:00',
    status: 'upcoming',
    tags: ['coding', 'innovation', 'prizes'],
    imageUrl: 'https://picsum.photos/seed/hackathon/800/400',
    participantsCount: 127,
    maxParticipants: 200,
    createdAt: '2024-01-15T00:00:00'
  },
  {
    id: 'e2',
    collegeId: 'c2',
    title: 'Cultural Fest - Harmony 2024',
    description: 'Celebrate diversity and creativity through music, dance, drama, and art performances from colleges across the region.',
    category: 'cultural',
    location: 'City Cultural Center',
    startDate: '2024-02-20T18:00:00',
    endDate: '2024-02-22T23:00:00',
    status: 'upcoming',
    tags: ['music', 'dance', 'art', 'culture'],
    imageUrl: 'https://picsum.photos/seed/cultural/800/400',
    participantsCount: 342,
    maxParticipants: 500,
    createdAt: '2024-01-20T00:00:00'
  },
  {
    id: 'e3',
    collegeId: 'c3',
    title: 'Basketball Championship',
    description: 'Annual inter-college basketball tournament featuring teams from 16 colleges competing for the championship title.',
    category: 'sports',
    location: 'Sports University Arena',
    startDate: '2024-02-10T10:00:00',
    endDate: '2024-02-14T16:00:00',
    status: 'completed',
    tags: ['sports', 'competition', 'fitness'],
    imageUrl: 'https://picsum.photos/seed/basketball/800/400',
    participantsCount: 160,
    maxParticipants: 160,
    createdAt: '2023-12-10T00:00:00'
  },
  {
    id: 'e4',
    collegeId: 'c1',
    title: 'Web Development Workshop',
    description: 'Learn the latest web technologies including React, Tailwind CSS, and Node.js in this intensive 1-day workshop.',
    category: 'workshop',
    location: 'Tech University Lab 3',
    startDate: '2024-03-05T10:00:00',
    endDate: '2024-03-05T17:00:00',
    status: 'upcoming',
    tags: ['learning', 'web', 'react'],
    imageUrl: 'https://picsum.photos/seed/workshop/800/400',
    participantsCount: 45,
    maxParticipants: 50,
    createdAt: '2024-02-01T00:00:00'
  },
  {
    id: 'e5',
    collegeId: 'c1',
    title: 'Campus Tech Expo 2024',
    description: 'A showcase of the latest student innovations in robotics, AI, and sustainable energy. Open for public viewing and investor pitches.',
    category: 'other',
    location: 'Innovation Hall',
    startDate: '2024-03-12T09:00:00',
    endDate: '2024-03-12T17:00:00',
    status: 'upcoming',
    tags: ['tech', 'innovation', 'exhibition'],
    imageUrl: 'https://picsum.photos/seed/techexpo/800/400',
    participantsCount: 200,
    maxParticipants: 500,
    createdAt: '2024-02-10T10:00:00'
  },
  {
    id: 'e6',
    collegeId: 'c2',
    title: 'National Debate League',
    description: 'Teams from 20 universities debate on pressing global issues. Witness the battle of wits and rhetoric.',
    category: 'cultural',
    location: 'Arts College Auditorium',
    startDate: '2024-03-18T10:00:00',
    endDate: '2024-03-19T16:00:00',
    status: 'upcoming',
    tags: ['debate', 'speech', 'politics'],
    imageUrl: 'https://picsum.photos/seed/debate/800/400',
    participantsCount: 64,
    maxParticipants: 100,
    createdAt: '2024-02-15T09:00:00'
  },
  {
    id: 'e7',
    collegeId: 'c3',
    title: 'RoboWars 2024',
    description: 'Design, build, and battle! The ultimate robotics competition where engineering meets strategy.',
    category: 'hackathon',
    location: 'Tech University Indoor Stadium',
    startDate: '2024-03-25T09:00:00',
    endDate: '2024-03-26T18:00:00',
    status: 'upcoming',
    tags: ['robotics', 'engineering', 'competition'],
    imageUrl: 'https://picsum.photos/seed/robowars/800/400',
    participantsCount: 60,
    maxParticipants: 100,
    createdAt: '2024-02-25T00:00:00'
  },
  {
    id: 'e8',
    collegeId: 'c2',
    title: 'Literature & Poetry Summit',
    description: 'A gathering of young poets and writers. Features open mic sessions, creative writing workshops, and guest speakers.',
    category: 'cultural',
    location: 'Arts College Auditorium',
    startDate: '2024-04-05T10:00:00',
    endDate: '2024-04-05T16:00:00',
    status: 'upcoming',
    tags: ['literature', 'poetry', 'arts'],
    imageUrl: 'https://picsum.photos/seed/poetry/800/400',
    participantsCount: 85,
    maxParticipants: 150,
    createdAt: '2024-03-01T00:00:00'
  },
  {
    id: 'e9',
    collegeId: 'c3',
    title: 'Spring Marathon',
    description: 'Run for a cause! Annual inter-college 10K run promoting health and wellness.',
    category: 'sports',
    location: 'University Sports Complex',
    startDate: '2024-04-15T06:00:00',
    endDate: '2024-04-15T11:00:00',
    status: 'upcoming',
    tags: ['fitness', 'marathon', 'health'],
    imageUrl: 'https://picsum.photos/seed/marathon/800/400',
    participantsCount: 300,
    maxParticipants: 1000,
    createdAt: '2024-03-05T00:00:00'
  },
  {
    id: 'e10',
    collegeId: 'c2',
    title: 'AI Art & Design Workshop',
    description: 'Learn how to use Generative AI tools to create stunning digital art. No prior experience required.',
    category: 'workshop',
    location: 'Design Studio B',
    startDate: '2024-04-20T11:00:00',
    endDate: '2024-04-20T15:00:00',
    status: 'upcoming',
    tags: ['AI', 'art', 'design', 'digital'],
    imageUrl: 'https://picsum.photos/seed/aiart/800/400',
    participantsCount: 30,
    maxParticipants: 50,
    createdAt: '2024-03-10T14:00:00'
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
