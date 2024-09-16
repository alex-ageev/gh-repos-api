import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { Repository } from './repositories.model';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    SequelizeModule.forFeature([Repository]),
    forwardRef(() => UsersModule),
    HttpModule,
  ],
  providers: [RepositoriesService],
  controllers: [RepositoriesController],
})
export class RepositoriesModule {}
