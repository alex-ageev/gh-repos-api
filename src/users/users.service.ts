import { Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async findOrCreateUser(login: string, avatarUrl: string): Promise<User> {
    // Find user by login
    let user = await this.userRepository.findOne({ where: { login } });

    if (!user) {
      // Create a new user if not found
      user = await this.userRepository.create({ login, avatarUrl });
    } else {
      // Update existing user's avatar URL if necessary
      user.avatarUrl = avatarUrl;
      await user.save();
    }

    return user;
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }
}