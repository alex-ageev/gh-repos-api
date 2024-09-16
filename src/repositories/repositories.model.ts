import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'repositories' })
export class Repository extends Model<Repository> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  language: string;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @Column(DataType.STRING)
  userLogin?: string;

  @Column(DataType.STRING)
  userAvatarUrl?: string;
}
