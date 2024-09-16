import { Controller, Get, Param, Post, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  // Endpoint 1: Fetch and store all public repositories for a user
  @Post(':username')
  @ApiOperation({ summary: 'Fetch and store all public repositories for a user' })
  @ApiResponse({ status: 200, description: 'Repositories stored successfully.' })
  async fetchAndStoreUserRepos(@Param('username') username: string): Promise<void> {
    await this.repositoriesService.fetchAndStoreUserRepos(username);
  }

  // Endpoint 2: List all repositories by a user's login
  @Get(':username')
  @ApiOperation({ summary: 'List all repositories by a user\'s login' })
  @ApiResponse({ status: 200, description: 'List of repositories.', type: [CreateRepositoryDto] })
  async listRepositoriesByUsername(@Param('username') username: string) {
    try {
      return await this.repositoriesService.listRepositoriesByUsername(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }

  // Endpoint 3: Search repositories by keywords
  @Get('search')
  @ApiOperation({ summary: 'Search repositories by keywords' })
  @ApiResponse({ status: 200, description: 'List of repositories matching search keywords.', type: [CreateRepositoryDto] })
  async searchRepositories(@Query('q') search: string) {
    return this.repositoriesService.searchRepositoriesByKeyword(search);
  }
}