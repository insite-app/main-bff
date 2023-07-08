import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the student' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the student',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the student',
  })
  @IsString()
  phone: string;
}
