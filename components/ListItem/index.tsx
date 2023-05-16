import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { markdownToTxt } from 'markdown-to-txt';

import  type { IArticle } from 'pages/api';

import styles from './index.module.scss';
const ListItem = (props: {article: IArticle}) => {
  const { article, article: { user } } = props;
  return (

      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article?.update_time))}
            </span>
          </div>
          <Link href={`/article/${article.id}`}>

            <h4 className={styles.title}>{article?.title}</h4>
            </Link>
          <p className={styles.content}>{markdownToTxt(article?.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
            <span className={styles.item}>{article?.views}</span>
          </div>
        </div>
        <Avatar src={user?.avatar} size={48} />
      </div>
  );
}

export default ListItem;;