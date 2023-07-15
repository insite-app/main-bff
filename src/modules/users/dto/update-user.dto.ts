import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'XYZ Corporation',
    description: 'The name of the organization',
    required: false,
  })
  @IsString()
  @IsOptional()
  organization_name?: string;

  @ApiProperty({
    example: '+1-123-456-7890',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'John Doe is a software engineer',
    description: 'The bio of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
