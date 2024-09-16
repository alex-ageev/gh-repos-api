import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => RepositoriesModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}