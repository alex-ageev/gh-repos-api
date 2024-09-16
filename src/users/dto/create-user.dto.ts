import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The login of the user' })
  login: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'The avatar URL of the user' })
  avatarUrl: string;
}
