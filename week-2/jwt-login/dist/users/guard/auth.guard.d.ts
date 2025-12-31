import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AuthGuard implements CanActivate {
    private readonly jwtservice;
    constructor(jwtservice: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
