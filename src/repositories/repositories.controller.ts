import { Controller, Get, Param, Post, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) { }

  // Endpoint 1: Fetch and store all public repos for a user
  @Post(':username')
  @ApiOperation({ summary: 'Fetch and store all public repositories for a user' })
  @ApiResponse({ status: 200, description: 'Fetched user and repositories', type: Object })
  async fetchAndStoreUserRepos(@Param('username') username: string): Promise<{ user: any; repos: any[] }> {
    try {
      return await this.repositoriesService.fetchAndStoreUserRepos(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  // Endpoint 3: Search repos by keywords
  @Get('search')
  @ApiOperation({ summary: 'Search repositories by keywords' })
  @ApiResponse({ status: 200, description: 'List of repositories matching search keywords.', type: [CreateRepositoryDto] })
  @ApiResponse({ status: 404, description: 'No repositories found' })
  async searchRepositories(@Query('q') search: string) {
    const repos = await this.repositoriesService.searchRepositoriesByKeyword(search);
    if (repos.length === 0) {
      throw new NotFoundException('No repositories found');
    }
    return repos;
  }

  // Endpoint 2: List all repos by a users login
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
}