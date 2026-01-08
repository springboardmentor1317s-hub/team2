export enum UserRole {
  STUDENT = 'student',
  COLLEGE_ADMIN = 'college_admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  role: UserRole;
  password?: string; // Mock password for demo
  lastActive?: string;
  status?: 'Active' | 'Inactive';
}

export interface Event {
  _id: string;
  title: string;
  collegeName: string;
  category: 'cultural' | 'sports' | 'hackathon' | 'workshop' | 'other';
  collegeId: string;
  organizerId: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  maxParticipants: number;
  participantsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface AdminLog {
  id: string;
  action: string;
  userId: string; // The admin who performed the action
  targetId?: string; // The ID of the affected entity (user/event)
  details: string;
  timestamp: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  color: string;
}
