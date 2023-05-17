import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Articles } from './articles';

@Entity({ name: 'comments' })
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  content!: string;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @ManyToOne(()=> User)
  @JoinColumn({name: 'user_id'})
  user!: User

  @ManyToOne(()=> Articles)
  @JoinColumn({name: 'article_id'})
  article!: Articles

  @Column()
  article_id!: number;
}