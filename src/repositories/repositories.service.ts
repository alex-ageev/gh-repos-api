import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { firstValueFrom } from "rxjs";
import { Op } from "sequelize";
import { Repository } from "./repositories.model";
import { UsersService } from "src/users/users.service";
import { CreateRepositoryDto } from "./dto/create-repository.dto";

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectModel(Repository) private repositoryModel: typeof Repository,
    private usersService: UsersService,
    private httpService: HttpService,
  ) { }

  async fetchAndStoreUserRepos(username: string): Promise<{ user: any; repos: CreateRepositoryDto[] }> {
    const userResponse = await firstValueFrom(this.httpService.get(`https://api.github.com/users/${username}`));
    const reposResponse = await firstValueFrom(this.httpService.get(`https://api.github.com/users/${username}/repos`));

    const user = await this.usersService.findOrCreateUser(
      userResponse.data.login,
      userResponse.data.avatar_url,
    );

    const existingRepos = await this.repositoryModel.findAll({
      where: { userId: user.id }
    });

    const existingRepoIds = new Set(existingRepos.map(repo => repo.id));
    const fetchedRepoIds = new Set(reposResponse.data.map(repo => repo.id));

    const reposToDelete = existingRepos.filter(repo => !fetchedRepoIds.has(repo.id));
    await this.repositoryModel.destroy({
      where: { id: reposToDelete.map(repo => repo.id) }
    });

    const repositories: CreateRepositoryDto[] = [];
    for (const repo of reposResponse.data) {
      await this.repositoryModel.upsert({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        createdAt: new Date(repo.created_at),
        userId: user.id,
      });
      repositories.push({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        createdAt: new Date(repo.created_at),
        userId: user.id,
        userLogin: user.login,
        userAvatarUrl: user.avatarUrl,
      });
    }

    return { user, repos: repositories };
  }

  async listRepositoriesByUsername(username: string): Promise<Repository[]> {
    const user = await this.usersService.getUserByLogin(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repositoryModel.findAll({ where: { userId: user.id } });
  }

  async searchRepositoriesByKeyword(search: string): Promise<CreateRepositoryDto[]> {
    console.log('searchRepositoriesByKeyword: search query', search);
  
    const repos = await this.repositoryModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      },
    });
    console.log('searchRepositoriesByKeyword: found repositories', repos);

    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.url,
      language: repo.language,
      createdAt: repo.createdAt,
      userId: repo.userId,
      userLogin: repo.userLogin,
      userAvatarUrl: repo.userAvatarUrl,
    }));
  }
}
