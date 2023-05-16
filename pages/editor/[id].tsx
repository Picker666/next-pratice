import type { NextPage } from "next";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input, Button, message, Select } from 'antd';
import prepareConnection from 'db/index';
import { Articles } from 'db/entity';

import { useRouter } from 'next/router';
import { useStore } from 'store/index';
import request from 'service/fetch';

import styles from './index.module.scss';
import { IArticle } from 'pages/api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export async function getServerSideProps (context: {params: any}) {
	const db = await prepareConnection();
	const article = await db.getRepository(Articles).findOne({id: context.params.id},{relations: ['user']});
	// const article = await db.getRepository(Articles).findOne({where: {id: context.params.id},relations: ['user']});
	console.log('article: ', article);

	return {
		props: {article: JSON.parse(JSON.stringify(article))}
	}
}

const NewEditor = (props: {article: IArticle}) => {
  const store = useStore();
  const { push, back } = useRouter();
  const { userId } = store.user.userInfo;

  const { id, title: articleTitle, content: articleContent } = props.article;

  const [title, setTitle] = useState(articleTitle);
  const [content, setContent] = useState(articleContent);
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || []);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题');
      return;
    }
    request
      .post('/api/article/update', {
				id,
        title,
        content,
        tagIds,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          userId ? push(`/user/${userId}`) : push('/');
          message.success('发布成功');
        } else {
          message.error(res?.msg || '发布失败');
        }
      });
  };

  const handleBack = () => {
    back();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const handleContentChange = (content: any) => {
    setContent(content);
  };

  const handleSelectTag = (value: []) => {
    setTagIds(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Button
          ghost
          type="primary"
          onClick={handleBack}
        >
          后退
        </Button>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?.id} value={tag?.id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
}

NewEditor.layout = null;

export default observer(NewEditor);