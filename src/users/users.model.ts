import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  login: string;
  avatarUrl: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'user', description: 'User login' })
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  login: string;

  @ApiProperty({example: 'https://api.github.com/users/user', description: 'User avatar URL'})
  @Column({ type: DataType.STRING, allowNull: true })
  avatarUrl: string;
}
