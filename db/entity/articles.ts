import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user';
import { Comments } from './comments'


@Entity({ name: 'articles' })
export class Articles extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: string;

  @Column()
  content!: string;

  @Column()
  title!: string;

  @Column()
  views!: number;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: boolean;

  @ManyToOne(()=> User, {
    cascade: true
  })
  @JoinColumn({name: 'user_id'})
  user!: User

  @OneToMany(() => Comments, (comment) => comment.article)
  comments!: Comments[]
}