"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async create(createUserDto) {
        const alreadyPresent = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (alreadyPresent)
            throw new common_1.ConflictException('Email is already taken');
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
    async login(loginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
        });
        if (!user)
            throw new common_1.NotFoundException('Email is not valid');
        const isMatch = await bcrypt.compare(loginUserDto.password, user?.hash ?? '');
        if (!isMatch)
            throw new common_1.UnauthorizedException('Password is wrong');
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
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            role: user?.roles,
        };
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (user?.roles === 'ADMIN')
            throw new common_1.ConflictException('Cannot Delete an admin account');
        return await this.userRepository.delete({ id });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map