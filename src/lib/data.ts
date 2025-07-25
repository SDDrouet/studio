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
  assigneeId?: string; // Storing user doc ID
};

export type Project = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  memberIds: string[]; // Storing user UIDs
  observations?: string;
  // Tasks are now a sub-collection, so not stored directly on the project document
};

// Mock data is no longer the source of truth.
// The data will be fetched from Firestore.
// You can remove this file or keep it for type definitions.

export const users: User[] = [];
export const projects: Project[] = [];
export const findProjectById = (id: string) => undefined;
