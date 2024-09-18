import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './jwt.strategy';
import { Role } from './enum/role.enum';
import { ROLES_KEY } from './jwt-roles.guard';
import { Jwtconstantcs } from './secret';
import { UserRepository } from 'src/user/repositories/user.repository';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository:UserRepository,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    

    if (!token) {
      throw new UnauthorizedException();


    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: Jwtconstantcs.secret,
      });
      const requiredRoles = this.getRequiredRoles(context);

      const user = await this.userRepository.findOne(payload.sub) 
       

      if(user.banned) { 
        
        throw new  UnauthorizedException()
      }      
    
      
      if (requiredRoles.length) {
        return requiredRoles.some((role) => payload.role === role);      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private getRequiredRoles(context: ExecutionContext): Role[] {
    return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
