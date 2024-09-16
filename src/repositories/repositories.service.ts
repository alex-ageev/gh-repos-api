import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { firstValueFrom } from "rxjs";
import { Op } from "sequelize";
import { Repository } from "./repositories.model";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RepositoriesService {
  constructor(
    @InjectModel(Repository) private repositoryModel: typeof Repository,
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  async fetchAndStoreUserRepos(username: string): Promise<void> {
    const userResponse = await firstValueFrom(this.httpService.get(`https://api.github.com/users/${username}`));
    const reposResponse = await firstValueFrom(this.httpService.get(`https://api.github.com/users/${username}/repos`));

    const user = await this.usersService.findOrCreateUser(
      userResponse.data.login,
      userResponse.data.avatar_url,
    );

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
    }
  }

  async listRepositoriesByUsername(username: string): Promise<Repository[]> {
    const user = await this.usersService.getUserByLogin(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repositoryModel.findAll({ where: { userId: user.id } });
  }

  async searchRepositoriesByKeyword(search: string): Promise<Repository[]> {
    return this.repositoryModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      },
    });
  }
}