import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async findOrCreateUser(login: string, avatarUrl: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      user = await this.userRepository.create({ login, avatarUrl });
    } else {
      user.avatarUrl = avatarUrl;
      await user.save();
    }

    return user;
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }
}