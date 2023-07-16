import { IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;
}
