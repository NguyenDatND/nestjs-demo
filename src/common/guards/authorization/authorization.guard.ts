import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorators';
import { API_ERROR_MSG } from 'src/configs/messages/api';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest<Request>()['user'];

    if (!user) {
      throw new UnauthorizedException(API_ERROR_MSG.UNAUTHORIZED);
    }

    if (contextRoles.some((role) => user['role'] === role)) {
      return true;
    } else {
      throw new ForbiddenException(API_ERROR_MSG.FORBIDDEN_RESOURCE);
    }
  }
}
