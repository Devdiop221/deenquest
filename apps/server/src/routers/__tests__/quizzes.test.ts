import { quizzesRouter } from '../quizzes';
import { db } from '../../db';

// Mock the database
jest.mock('../../db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
  },
}));

describe('Quizzes Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all quizzes', async () => {
      const mockQuizzes = [
        {
          id: '1',
          title: 'Prophet Quiz',
          question: 'Who was the first Prophet?',
          options: ['Adam', 'Noah', 'Abraham', 'Moses'],
          correctAnswerIndex: 0,
          explanation: 'Adam was the first Prophet and human being.',
          categoryId: '1',
          xpReward: 10,
          createdAt: new Date(),
        },
      ];

      (db.select as jest.Mock).mockResolvedValue(mockQuizzes);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getAll();

      expect(result).toEqual(mockQuizzes);
      expect(db.select).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      (db.select as jest.Mock).mockResolvedValue([]);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return quiz by id', async () => {
      const mockQuiz = {
        id: '1',
        title: 'Prophet Quiz',
        question: 'Who was the first Prophet?',
        options: ['Adam', 'Noah', 'Abraham', 'Moses'],
        correctAnswerIndex: 0,
        explanation: 'Adam was the first Prophet and human being.',
        categoryId: '1',
        xpReward: 10,
        createdAt: new Date(),
      };

      (db.select as jest.Mock).mockResolvedValue([mockQuiz]);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getById({ id: '1' });

      expect(result).toEqual(mockQuiz);
    });

    it('should return null for non-existent quiz', async () => {
      (db.select as jest.Mock).mockResolvedValue([]);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getById({ id: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('getByCategory', () => {
    it('should return quizzes for a specific category', async () => {
      const mockQuizzes = [
        {
          id: '1',
          title: 'Prophet Quiz 1',
          question: 'Who was the first Prophet?',
          categoryId: 'prophets',
        },
        {
          id: '2',
          title: 'Prophet Quiz 2',
          question: 'Who was the last Prophet?',
          categoryId: 'prophets',
        },
      ];

      (db.select as jest.Mock).mockResolvedValue(mockQuizzes);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getByCategory({ categoryId: 'prophets' });

      expect(result).toEqual(mockQuizzes);
    });

    it('should validate category id parameter', async () => {
      const caller = quizzesRouter.createCaller({});

      await expect(caller.getByCategory({ categoryId: '' })).rejects.toThrow();
    });
  });

  describe('getRandom', () => {
    it('should return random quizzes', async () => {
      const mockQuizzes = [
        { id: '1', title: 'Quiz 1' },
        { id: '2', title: 'Quiz 2' },
        { id: '3', title: 'Quiz 3' },
      ];

      (db.select as jest.Mock).mockResolvedValue(mockQuizzes);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getRandom({ limit: 2 });

      expect(result).toHaveLength(2);
      expect(result.every(quiz => mockQuizzes.some(mock => mock.id === quiz.id))).toBe(true);
    });

    it('should respect the limit parameter', async () => {
      const mockQuizzes = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Quiz ${i + 1}`,
      }));

      (db.select as jest.Mock).mockResolvedValue(mockQuizzes);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getRandom({ limit: 5 });

      expect(result).toHaveLength(5);
    });

    it('should use default limit when not specified', async () => {
      const mockQuizzes = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Quiz ${i + 1}`,
      }));

      (db.select as jest.Mock).mockResolvedValue(mockQuizzes);

      const caller = quizzesRouter.createCaller({});
      const result = await caller.getRandom({});

      expect(result).toHaveLength(10); // Default limit
    });
  });
});