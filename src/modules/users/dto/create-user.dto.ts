import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'The role of the user',
  })
  @IsString()
  role: string;

  @ApiProperty({
    example: 'generated-uuid',
    description: 'The ID of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;
}
