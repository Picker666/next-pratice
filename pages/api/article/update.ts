import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { Articles } from 'db/entity';
import { ISession } from 'pages/api/index';

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

  let responseData = { code: 0, msg: '发布成功'}
	console.log('session: ', session);
  if (article && article.user.id === session.id) {
		article.content = content;
		article.title = title;
		const response = await article.save();
		console.log('response: ', response);
    responseData.msg = '更新文章成功...';
  } else {
    responseData.code = -1;
    responseData.msg = '用户不存在';
  }


  res.status(200).json(responseData);
};

export default withIronSessionApiRoute(publish, ironOptions);