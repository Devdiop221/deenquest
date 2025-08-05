// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/deenquest_test';
process.env.BETTER_AUTH_SECRET = 'test-secret';
process.env.BETTER_AUTH_URL = 'http://localhost:3000/api/auth';

// Mock database connection
jest.mock('./src/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);