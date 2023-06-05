import type { NextPage } from 'next';
import prepareConnection from 'db/index';
import { Articles } from "db/entity";
import ListItem from 'components/ListItem';
import type { IArticle } from 'type/index';
import {Divider } from 'antd';

interface IArticles {
  articles: string; // IArticle[];
}
export async function getStaticProps () {
  const db = await prepareConnection();
  const articles = await db.getRepository(Articles).find({relations: ['user', 'tags']});

  return {
    props: {articles: JSON.stringify(articles.reverse())},
    revalidate: 10
  }
}

const UserHomePage = function (props: IArticles) {
  const {articles=''} = props;

  return (
    <div className="content-layout">
      {JSON.parse(articles)?.map((article: IArticle) => (
        <div key={article.id}>
          <ListItem article={article} />
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default UserHomePage;
