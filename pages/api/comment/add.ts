import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { User, Articles, Comments } from 'db/entity';
import prepareConnection from 'db';
import { ISession, IComment, IResponse  } from 'type/index';
import { ironOptions } from 'config/index';

import { EXCEPTION_ARTICLE, EXCEPTION_COMMENT } from '../config/codes';

const add = async (req: NextApiRequest, res: NextApiResponse) => {
	const { articleId, content } = req.body;
	const session: ISession = req.session;
	const { id : userId} = session;
	const db = await prepareConnection();
	const articlesRepo = db.getRepository(Articles);
	const userRepo = db.getRepository(User);

	const article = await articlesRepo.findOne({where: {id: articleId}, relations: []});
	const user = await userRepo.findOne({id: userId});
	let responseData: IResponse<IComment[]> = {code: 0, msg: '评论成功。。。'};
	if (article && user) {
		const commentsRepo = db.getRepository(Comments);
    const newComment = new Comments()
		newComment.content = content;
		newComment.create_time = new Date();
		newComment.update_time = new Date();
		newComment.article = [article];
		newComment.user = [user];
		console.log('newComment: ', newComment);

		const response = await commentsRepo.save(newComment);
		console.log('response: ', response);
		if (!response) {
			responseData = EXCEPTION_COMMENT.PUBLISH_FAILED;
		}
	} else {
		responseData = EXCEPTION_ARTICLE.NOT_FOUND;
	}

	res.status(200).send(responseData);
}

export default withIronSessionApiRoute(add, ironOptions)
