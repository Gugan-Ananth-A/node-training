import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtservice: JwtService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const authorisation = request.headers.authorization as string;
      const token = authorisation.split(' ')[1];

      if (!token) throw new UnauthorizedException();
      await this.jwtservice.verifyAsync(`${token}`);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
