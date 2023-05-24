import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, OneToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Articles } from './articles';
import { Comments } from './comments'


@Entity({ name: 'tags' })
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: string;

  @Column()
  title!: string;

  @Column()
  icon!: string;

  @Column()
  follow_count!: number;

  @Column()
  article_count!: number;

  @ManyToMany(() => User, { cascade: true})

  @JoinTable({
    name: 'tags_users_rel',
    joinColumn: {
			name: 'tag_id'
    },
		inverseJoinColumn: {
			name: 'user_id'
		}
  })
	users?: User[]

	@ManyToMany(() => Articles, (article) => article.tags)
  @JoinTable({
    name: 'tags_article_rel',
    joinColumn: {
			name: 'tag_id'
    },
		inverseJoinColumn: {
			name: 'article_id'
		}
  })
	articles?: Articles[]

  // @OneToMany(() => Comments, (comment) => comment.article)
  // article!: Comments[]
}