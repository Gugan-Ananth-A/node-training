import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from './s3.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const alreadyPresent = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (alreadyPresent) throw new ConflictException('Email is already taken');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      hash: hashedPassword,
      roles: createUserDto.role,
    });

    const createdUser = await this.userRepository.save(user);
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.roles,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) throw new NotFoundException('Email is not valid');
    const isMatch = await bcrypt.compare(
      loginUserDto.password,
      user?.hash ?? '',
    );

    if (!isMatch) throw new UnauthorizedException('Password is wrong');

    const tokenPayload = {
      sub: user.id,
      userName: user.name,
      role: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roles,
      accessToken,
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles,
      };
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.roles,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async uploadToS3(file: Express.Multer.File) {
    await this.s3Service.client.send(
      new PutObjectCommand({
        Bucket: 'gugan-node-training',
        Key: file.originalname,
        Body: file.buffer,
      }),
    );
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (user?.roles === 'ADMIN')
      throw new ConflictException('Cannot Delete an admin account');

    return await this.userRepository.delete({ id });
  }
}
