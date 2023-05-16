import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { Articles } from 'db/entity';
import { ISession } from 'pages/api/index';

import {  EXCEPTION_ARTICLE } from '../config/codes';

const publish = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: ISession = req.session;
  const { title, content, id } = req.body;

  const db = await prepareConnection();
  const articleRepo = db.getRepository(Articles);

  let article = null;
  if (id) {
    article = await articleRepo.findOne({where: { id }, relations: ['user']});
  }
	console.log('article: ', article);

  let responseData = { code: 0, msg: '更新文章成功'}
	console.log('session: ', session);
  if (article && article.user.id === session.id) {
		article.content = content;
		article.title = title;
    article.update_time = new Date();
		await article.save();
  } else {
    responseData = EXCEPTION_ARTICLE.UPDATE_FAILED;
  }


  res.status(200).json(responseData);
};

export default withIronSessionApiRoute(publish, ironOptions);