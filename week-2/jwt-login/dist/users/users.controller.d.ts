import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import type { Request as Req } from 'express';
export declare class UsersController {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    login(body: LoginUserDto): Promise<{
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
    findOne(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    remove(id: string, request: Req): Promise<import("typeorm").DeleteResult>;
}
