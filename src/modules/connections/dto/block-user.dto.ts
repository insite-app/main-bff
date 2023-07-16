import { IsUUID } from 'class-validator';

export class BlockUserDto {
  @IsUUID()
  blockerId: string;

  @IsUUID()
  blockedId: string;
}
