import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from './guard/auth.guard';
import { describe } from 'node:test';
import { CreateUserDto } from './dto/create-user.dto';

const mockUsersService = {
  create: jest.fn(),
  login: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  uploadToS3: jest.fn(),
};

const mockJwtService = {
  verifyAsync: jest.fn(),
};

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

const mockThrottlerGuard = {
  canActivate: jest.fn(() => true),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(ThrottlerGuard)
      .useValue(mockThrottlerGuard)
      .compile();

    usersController = testingModule.get(UsersController);
    usersService = testingModule.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('Login', () => {
    it('should login user and return token', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'Password@123',
      };

      mockUsersService.login.mockResolvedValue({
        id: 1,
        name: 'Test',
        email: dto.email,
        role: 'USER',
        accessToken: 'jwt-token',
      });

      const result = await usersController.login(dto);

      const loginSpy = jest.spyOn(usersService, 'login');
      expect(loginSpy).toHaveBeenCalledWith(dto);
      expect(result.accessToken).toBe('jwt-token');
    });
  }).catch((e) => console.log(e));

  describe('Register', () => {
    it('should create new user', async () => {
      const dto = {
        name: 'Luffy',
        email: 'luffy@one.piece',
        password: 'one-piece',
        role: 'ADMIN',
      };
      mockUsersService.create.mockResolvedValue({
        id: 1,
        name: dto.name,
        email: dto.email,
        role: dto.role,
      });

      const result = await usersController.create(dto as CreateUserDto);
      const registerSpy = jest.spyOn(usersService, 'create');
      expect(registerSpy).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(1);
    });
  }).catch((e) => console.log(e));

  describe('Get User', () => {
    it('Should get one user', async () => {
      mockUsersService.findOne.mockResolvedValue({
        id: 1,
        name: 'Luffy',
        email: 'luffy@one.piece',
        role: 'ADMIN',
      });

      const result = await usersController.findOne('1');
      const getUserSpy = jest.spyOn(usersService, 'findOne');
      expect(getUserSpy).toHaveLength(0);
      expect(result.id).toBe(1);
    });
  }).catch((e) => console.log(e));
}).catch((e) => console.log(e));
