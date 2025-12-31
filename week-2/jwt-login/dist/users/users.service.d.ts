import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        accessToken: string;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
