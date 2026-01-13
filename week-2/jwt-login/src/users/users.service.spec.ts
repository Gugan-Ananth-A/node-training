import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { S3Service } from './s3.service';

const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockS3Service = {
  client: {
    send: jest.fn(),
  },
};

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        id: 1,
        name: 'Zoro',
        email: 'zoro@one.piece',
        roles: 'USER',
      });

      mockUserRepository.save.mockResolvedValue({
        id: 1,
        name: 'Luffy',
        email: 'luffy@one.piece',
        roles: 'USER',
      });

      const result = await usersService.create({
        name: 'Zoro',
        email: 'zoro@one.piece',
        password: 'password',
        role: 'USER',
      } as unknown as CreateUserDto);

      const findUser = jest.spyOn(usersRepository, 'findOne');
      expect(findUser).toHaveBeenCalled();
      const repositoryCalled = jest.spyOn(usersRepository, 'save');
      expect(repositoryCalled).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        name: 'Luffy',
        email: 'luffy@one.piece',
        role: 'USER',
      });
    });
  });
});
