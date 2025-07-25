export type User = {
  id: string; // Document ID from Firestore
  uid: string; // Firebase Auth UID
  name: string;
  avatar: string;
  email: string;
  timezone?: string;
  workStyle?: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description:string;
  dueDate: string;
  completed: boolean;
  assigneeId: string | null; // Storing user doc ID
};

export type Project = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  memberIds: string[]; // Storing user UIDs
  ownerId: string;
  status: 'in-progress' | 'completed';
};

export type Feedback = {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any; // serverTimestamp
}

// Mock data is no longer the source of truth.
// The data will be fetched from Firestore.
// You can remove this file or keep it for type definitions.

export const users: User[] = [];
export const projects: Project[] = [];
export const findProjectById = (id: string) => undefined;
