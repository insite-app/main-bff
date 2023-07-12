import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserDataService from 'src/modules/users/user-data.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userDataService: UserDataService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (request?.user) {
      const { id } = request.user;
      const role = await this.userDataService.findUserRoleById(id);
      if (roles.includes(role)) {
        return true;
      } else {
        throw new UnauthorizedException(
          'You do not have permission to perform this action.',
        );
      }
    }
  }
}
