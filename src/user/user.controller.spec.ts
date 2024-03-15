import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call userService.create with the expected DTO and return the result', async () => {
      const createUserDto = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      };
      const result: any = { id: 1, ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: any = [{ id: 1, name: 'Test User' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result: any = { id: 1, name: 'Test User' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  // Continuação do seu arquivo de teste...

  describe('update', () => {
    it('should call userService.update with the right parameters and return the result', async () => {
      const userId = '1';
      const updateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword',
      }; // Adapte conforme sua implementação real
      const result: any = { id: +userId, ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(userId, updateUserDto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call userService.remove with the right parameter and return the result', async () => {
      const userId = '1';
      const result: any = { affected: 1 };

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(userId)).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(+userId);
    });
  });
});
