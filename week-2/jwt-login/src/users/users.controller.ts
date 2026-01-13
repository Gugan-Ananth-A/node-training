import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import type { Request as Req } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) body: LoginUserDto) {
    return this.usersService.login(body);
  }

  @Get()
  @UseGuards(ThrottlerGuard, AuthGuard)
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @CacheTTL(60000)
  @CacheKey('user')
  findOne(@Param('id', ValidationPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @Post('upload')
  @UseGuards(ThrottlerGuard, AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadToS3(file);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ValidationPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id', ValidationPipe) id: string,
    @Request() request: Req,
  ) {
    const authorization = request.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    const token = authorization.split(' ')[1];
    const payload = await this.jwtService.verifyAsync<CreateUserDto>(token);
    const role = payload.role;
    if (role === 'ADMIN') return this.usersService.remove(+id);
    throw new ForbiddenException('Only Admins are allowed to delete records');
  }
}
