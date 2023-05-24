import type { NextPage } from 'next';
import prepareConnection from 'db/index';
import { Articles } from "db/entity";
import ListItem from 'components/ListItem';
import type { IArticle } from 'type/index';
import {Divider } from 'antd';

interface IArticles {
  articles: IArticle[];
}
export async function getServerSideProps () {
  const db = await prepareConnection();
  const articles = await db.getRepository(Articles).find({relations: ['user']});

  return {
    props: {articles: JSON.parse(JSON.stringify(articles.reverse()))}
  }
}

const UserHomePage = (props: IArticles) => {
  const {articles} = props;

  return (
    <div className="content-layout">
      {articles.map((article) => (
        <div key={article.id}>
          <ListItem article={article} />
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default UserHomePage;
