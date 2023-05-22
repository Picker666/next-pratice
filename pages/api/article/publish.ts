import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { User, Articles } from 'db/entity';
import { ISession } from 'type/index';
import { setCookie } from 'utils';

import {  EXCEPTION_ARTICLE } from '../config/codes';

const publish = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: ISession = req.session;
  const { title, content, id } = req.body;

  const db = await prepareConnection();

  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Articles);

  let article = null;
  if (id) {
    article = await articleRepo.findOne({id});
  }
  const user = await userRepo.findOne({id: session.id});

  let responseData = { code: 0, msg: '发布成功'}
  if (article) {
    // TODO:
    responseData.msg = '更新文章成功...';
  } else if (user) {
    const newArticle = new Articles();
    newArticle.content = content;
    newArticle.title = title;
    newArticle.create_time = new Date();
    newArticle.update_time = newArticle.create_time;
    newArticle.user = user;

    const response = await articleRepo.save(newArticle);
    if (!response) {
      responseData = EXCEPTION_ARTICLE.PUBLISH_FAILED;
    }
  } else {
    responseData.code = -1;
    responseData.msg = '用户不存在';
  }


  res.status(200).json(responseData);
};

export default withIronSessionApiRoute(publish, ironOptions);