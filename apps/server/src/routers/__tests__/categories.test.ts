import { categoriesRouter } from '../categories';
import { db } from '../../db';

// Mock the database
jest.mock('../../db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  },
}));

describe('Categories Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Prophets',
          description: 'Stories of the Prophets',
          icon: 'User',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Companions',
          description: 'Stories of the Companions',
          icon: 'Users',
          createdAt: new Date(),
        },
      ];

      (db.select as jest.Mock).mockResolvedValue(mockCategories);

      const caller = categoriesRouter.createCaller({});
      const result = await caller.getAll();

      expect(result).toEqual(mockCategories);
      expect(db.select).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (db.select as jest.Mock).mockRejectedValue(new Error('Database error'));

      const caller = categoriesRouter.createCaller({});

      await expect(caller.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return category by id', async () => {
      const mockCategory = {
        id: '1',
        name: 'Prophets',
        description: 'Stories of the Prophets',
        icon: 'User',
        createdAt: new Date(),
      };

      (db.select as jest.Mock).mockResolvedValue([mockCategory]);

      const caller = categoriesRouter.createCaller({});
      const result = await caller.getById({ id: '1' });

      expect(result).toEqual(mockCategory);
    });

    it('should return null for non-existent category', async () => {
      (db.select as jest.Mock).mockResolvedValue([]);

      const caller = categoriesRouter.createCaller({});
      const result = await caller.getById({ id: 'non-existent' });

      expect(result).toBeNull();
    });

    it('should validate input parameters', async () => {
      const caller = categoriesRouter.createCaller({});

      await expect(caller.getById({ id: '' })).rejects.toThrow();
    });
  });
});