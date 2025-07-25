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
  { id: 'user-1', name: 'Alicia Johnson', avatar: 'https://i.pravatar.cc/150?u=user-1', email: 'alicia@example.com', timezone: 'GMT-5', workStyle: 'Madrugadora, prefiere la comunicación asíncrona.' },
  { id: 'user-2', name: 'Roberto Williams', avatar: 'https://i.pravatar.cc/150?u=user-2', email: 'roberto@example.com', timezone: 'GMT+1', workStyle: 'Noctámbulo, disfruta de las sesiones colaborativas.' },
  { id: 'user-3', name: 'Carlos Brown', avatar: 'https://i.pravatar.cc/150?u=user-3', email: 'carlos@example.com', timezone: 'GMT-8', workStyle: 'Flexible, se adapta a las necesidades del equipo.' },
  { id: 'user-4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?u=user-4', email: 'diana@example.com', timezone: 'GMT+8', workStyle: 'Enfocada, prefiere bloques de trabajo profundo.' },
];

const project1Tasks: Task[] = [
  { id: 'task-1-1', projectId: 'proj-1', title: 'Diseñar maquetas iniciales', description: 'Crear wireframes y maquetas de alta fidelidad para el panel principal.', dueDate: '2024-08-15', completed: true, assignee: users[0] },
  { id: 'task-1-2', projectId: 'proj-1', title: 'Desarrollar página de destino', description: 'Codificar el HTML, CSS y JS para la página de destino de marketing.', dueDate: '2024-08-20', completed: true, assignee: users[1] },
  { id: 'task-1-3', projectId: 'proj-1', title: 'Configurar esquema de base de datos', description: 'Definir e implementar los modelos de base de datos para usuarios, proyectos y tareas.', dueDate: '2024-08-25', completed: false, assignee: users[2] },
  { id: 'task-1-4', projectId: 'proj-1', title: 'Flujo de autenticación de usuario', description: 'Implementar la funcionalidad de inicio de sesión, registro y cierre de sesión.', dueDate: '2024-09-01', completed: false, assignee: users[3] },
];

const project2Tasks: Task[] = [
  { id: 'task-2-1', projectId: 'proj-2', title: 'Investigación de mercado para Q4', description: 'Analizar características de la competencia y demanda de los usuarios para el próximo trimestre.', dueDate: '2024-09-10', completed: true, assignee: users[0] },
  { id: 'task-2-2', projectId: 'proj-2', title: 'Redactar texto de marketing', description: 'Escribir un texto convincente para la próxima campaña de correo electrónico.', dueDate: '2024-09-15', completed: false, assignee: users[1] },
];

const project3Tasks: Task[] = [
  { id: 'task-3-1', projectId: 'proj-3', title: 'Refactorizar endpoints de API heredados', description: 'Mejorar el rendimiento y la legibilidad del código de la API antigua.', dueDate: '2024-08-30', completed: false, assignee: users[2] },
  { id: 'task-3-2', projectId: 'proj-3', title: 'Escribir pruebas de integración', description: 'Asegurar que todas las partes del sistema funcionen juntas como se espera.', dueDate: '2024-09-20', completed: false, assignee: users[3] },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Rediseño del Sitio Web',
    description: 'Una renovación completa del sitio web de la empresa con un nuevo sistema de diseño.',
    dueDate: '2024-09-30',
    members: users,
    tasks: project1Tasks,
  },
  {
    id: 'proj-2',
    name: 'Campaña de Marketing Q4',
    description: 'Planificación y ejecución de la estrategia de marketing para el último trimestre.',
    dueDate: '2024-10-15',
    members: [users[0], users[1]],
    tasks: project2Tasks,
  },
  {
    id: 'proj-3',
    name: 'Actualización de Infraestructura Backend',
    description: 'Migración de nuestros servidores y actualización de la base de datos principal.',
    dueDate: '2024-11-01',
    members: [users[2], users[3]],
    tasks: project3Tasks,
  },
];

export const findProjectById = (id: string) => projects.find(p => p.id === id);
