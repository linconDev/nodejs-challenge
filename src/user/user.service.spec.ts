import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = {
  [P in keyof T]?: jest.Mock;
};

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: MockRepository<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            insert: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
      };
      const expectedRawResponse = {
        fieldCount: expect.any(Number),
        affectedRows: expect.any(Number),
        insertId: expect.any(Number),
        info: expect.any(String),
        serverStatus: expect.any(Number),
        warningStatus: expect.any(Number),
        changedRows: expect.any(Number),
      };

      const expectedResponse = {
        identifiers: [{ id: expect.any(Number) }],
        generatedMaps: [{ id: expect.any(Number) }],
        raw: expectedRawResponse,
      };

      mockUserRepository.insert.mockResolvedValue(expectedResponse);
      await expect(service.create(createUserDto)).resolves.toEqual(
        expectedResponse,
      );
    });

    it('should throw an error if insert fails', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
      };
      mockUserRepository.insert.mockRejectedValue(
        new Error('Failed to insert'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          id: 1,
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'test123',
        },
        {
          id: 2,
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'test123',
        },
      ];

      mockUserRepository.find.mockResolvedValue(expectedUsers);

      await expect(service.findAll()).resolves.toEqual(expectedUsers);
    });
    it('should throw a BadRequestException if the find operation fails', async () => {
      const error = new Error('Failed to retrieve users');

      mockUserRepository.find.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(Error);

      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const foundUser = await service.findOne(1);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });

      expect(foundUser).toEqual(mockUser);
    });
    it('should throw a BadRequestException if the find operation fails', async () => {
      const userId = 1;
      const error = new Error('Failed to find user');

      // Simula um erro ao tentar buscar o usuário pelo ID
      mockUserRepository.findOneBy.mockRejectedValue(error);

      // Espera que o serviço lance uma BadRequestException quando a busca falhar
      await expect(service.findOne(userId)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('update', () => {
    it('should update a user successfully and return the updated user', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalpassword',
        updated_at: null,
      };
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        password: expect.any(String),
        updated_at: expect.any(String),
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: updateUserDto.name,
          email: updateUserDto.email,
        }),
      );
      expect(result).toEqual(updatedUser);
    });
    it('should throw a BadRequestException if user retrieval fails', async () => {
      const userId = 1;
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };
      const error = new Error('Failed to retrieve user');

      mockUserRepository.findOneBy.mockRejectedValue(error);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should throw a BadRequestException if update operation fails', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Original Name',
        email: 'original@example.com',
        password: 'originalpassword',
        updated_at: null,
      };
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'updatedpassword',
      };
      const error = new Error('Failed to update user');

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: expect.any(String),
        }),
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete a user and return the delete result', async () => {
      const userId = 1;
      const mockDeleteResult = {
        affected: 1,
      };

      mockUserRepository.delete.mockResolvedValue(mockDeleteResult);

      const result = await service.remove(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: userId });

      expect(result).toEqual(mockDeleteResult);
    });
    it('should throw a BadRequestException if delete operation fails', async () => {
      const userId = 1;
      const error = new Error('Failed to delete user');

      mockUserRepository.delete.mockRejectedValue(error);

      await expect(service.remove(userId)).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: userId });
    });
  });
});
