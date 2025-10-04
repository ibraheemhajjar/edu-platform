export const API_ROUTES = {
  COURSES: '/courses',
  STUDENTS: '/students',
  ENROLLMENTS: '/enrollments',
  SYNC_COURSES: '/courses/sync',
} as const;

export const MEDUSA_EVENTS = {
  ORDER_PLACED: 'order.placed',
  PAYMENT_COMPLETED: 'payment.completed',
} as const;

export const DATABASE = {
  POSTGRES_HOST: process.env['DATABASE_HOST'] || 'localhost',
  POSTGRES_PORT: parseInt(process.env['DATABASE_PORT'] || '5432'),
  POSTGRES_USER: process.env['DATABASE_USER'] || 'postgres',
  POSTGRES_PASSWORD: process.env['DATABASE_PASSWORD'] || 'postgres',
  POSTGRES_DB: process.env['DATABASE_NAME'] || 'edu_platform',
} as const;
