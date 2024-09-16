import { ApiProperty } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @ApiProperty({ example: 123456, description: 'The ID of the repository' })
  id: number;

  @ApiProperty({ example: 'repo-name', description: 'The name of the repository' })
  name: string;

  @ApiProperty({ example: 'A brief description of the repository', description: 'The description of the repository' })
  description: string;

  @ApiProperty({ example: 'https://github.com/user/repo-name', description: 'The URL of the repository' })
  url: string;

  @ApiProperty({ example: 'TypeScript', description: 'The primary language of the repository' })
  language: string;

  @ApiProperty({ example: '2024-09-16T00:00:00Z', description: 'The creation date of the repository' })
  createdAt: Date;

  @ApiProperty({ example: 123123, description: 'The ID of the user' })
  userId: number;

  @ApiProperty({ example: 'alex-ageev', description: 'The login of the user' })
  userLogin: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'The avatar URL of the user' })
  userAvatarUrl: string;
}
