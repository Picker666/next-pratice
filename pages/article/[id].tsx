import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns';
import prepareConnection from 'db/index';
import { Articles, Comments } from 'db/entity';
import { IArticle, IComment } from 'type/index';
import request from 'service/fetch';

import styles from './index.module.scss';

export async function getServerSideProps (context: {params: any}) {
  const db = await prepareConnection();
  const article = await db.getRepository(Articles).findOne({id: context.params.id},{relations: ['user', 'comments', 'comments.user']});
  // const article = await db.getRepository(Articles).findOne({where: {id: context.params.id},relations: ['user']});
  if (article) {
    article.views = article.views + 1;
    await article.save();
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    }
  }
}

const ArticleDetail = (props: {article: IArticle}) => {
  const { id: articleId, title, content, update_time, views, user: { id, nickname, avatar }={}, comments: originalComments } = props.article;
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(originalComments || []);

  const updateComments = async () => {
    const res: any = await request.post('/api/comment/query', {articleId});
    if (res.code === 0) {
      setComments(res.data);
    }
  }

  const handleComment = async () => {
    const res: any = await request.post('/api/comment/add', {articleId, content: inputVal})
    if (res.code === 0) {
      message.info(res.msg || '成功。。。');
      setInputVal('');
      updateComments();
    }
  }

	return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读 {views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${articleId}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(ArticleDetail);

