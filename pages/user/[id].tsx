import type { NextPage } from 'next';
import prepareConnection from 'db/index';
import { Articles } from "db/entity";
import ListItem from 'components/ListItem';
import type { IArticle } from 'pages/api';
import {Divider } from 'antd';

interface IArticles {
  articles: IArticle[];
}
export async function getServerSideProps () {
  const db = await prepareConnection();
  const articles = await db.getRepository(Articles).find({relations: ['user']});

  return {
    props: {articles: JSON.parse(JSON.stringify(articles))}
  }
}

const UserHomePage = (props: IArticles) => {
  const {articles} = props;
  console.log('articles: ', articles);

  return (
    <div className="content-layout">
      {articles.map((article) => (
        <>
          <ListItem article={article} />
          <Divider />
        </>
      ))}
    </div>
  );
};

export default UserHomePage;
