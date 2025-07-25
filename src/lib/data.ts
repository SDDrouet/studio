export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  timezone: string;
  workStyle: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  assignee?: User;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  members: User[];
  tasks: Task[];
  observations?: string;
};

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=user-1', email: 'alice@example.com', timezone: 'GMT-5', workStyle: 'Early bird, prefers async communication.' },
  { id: 'user-2', name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=user-2', email: 'bob@example.com', timezone: 'GMT+1', workStyle: 'Night owl, enjoys collaborative sessions.' },
  { id: 'user-3', name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?u=user-3', email: 'charlie@example.com', timezone: 'GMT-8', workStyle: 'Flexible, adapts to team needs.' },
  { id: 'user-4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?u=user-4', email: 'diana@example.com', timezone: 'GMT+8', workStyle: 'Focused, prefers deep work blocks.' },
];

const project1Tasks: Task[] = [
  { id: 'task-1-1', projectId: 'proj-1', title: 'Design initial mockups', description: 'Create wireframes and high-fidelity mockups for the main dashboard.', dueDate: '2024-08-15', completed: true, assignee: users[0] },
  { id: 'task-1-2', projectId: 'proj-1', title: 'Develop landing page', description: 'Code the HTML, CSS, and JS for the marketing landing page.', dueDate: '2024-08-20', completed: true, assignee: users[1] },
  { id: 'task-1-3', projectId: 'proj-1', title: 'Set up database schema', description: 'Define and implement the database models for users, projects, and tasks.', dueDate: '2024-08-25', completed: false, assignee: users[2] },
  { id: 'task-1-4', projectId: 'proj-1', title: 'User authentication flow', description: 'Implement login, signup, and logout functionality.', dueDate: '2024-09-01', completed: false, assignee: users[3] },
];

const project2Tasks: Task[] = [
  { id: 'task-2-1', projectId: 'proj-2', title: 'Market research for Q4', description: 'Analyze competitor features and user demand for the next quarter.', dueDate: '2024-09-10', completed: true, assignee: users[0] },
  { id: 'task-2-2', projectId: 'proj-2', title: 'Draft marketing copy', description: 'Write compelling copy for the upcoming email campaign.', dueDate: '2024-09-15', completed: false, assignee: users[1] },
];

const project3Tasks: Task[] = [
  { id: 'task-3-1', projectId: 'proj-3', title: 'Refactor legacy API endpoints', description: 'Improve performance and readability of old API code.', dueDate: '2024-08-30', completed: false, assignee: users[2] },
  { id: 'task-3-2', projectId: 'proj-3', title: 'Write integration tests', description: 'Ensure all parts of the system work together as expected.', dueDate: '2024-09-20', completed: false, assignee: users[3] },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'A complete overhaul of the company website with a new design system.',
    dueDate: '2024-09-30',
    members: users,
    tasks: project1Tasks,
  },
  {
    id: 'proj-2',
    name: 'Q4 Marketing Campaign',
    description: 'Planning and execution of the marketing strategy for the last quarter.',
    dueDate: '2024-10-15',
    members: [users[0], users[1]],
    tasks: project2Tasks,
  },
  {
    id: 'proj-3',
    name: 'Backend Infrastructure Upgrade',
    description: 'Migrating our servers and upgrading the main database.',
    dueDate: '2024-11-01',
    members: [users[2], users[3]],
    tasks: project3Tasks,
  },
];

export const findProjectById = (id: string) => projects.find(p => p.id === id);
