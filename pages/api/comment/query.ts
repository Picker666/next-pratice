import { NextApiRequest, NextApiResponse } from 'next';
import { Articles, Comments } from 'db/entity';
import prepareConnection from 'db';

import { EXCEPTION_ARTICLE, EXCEPTION_COMMENT } from '../config/codes';
import type { IComment, IResponse } from 'type/index';

const query = async (req: NextApiRequest, res: NextApiResponse) => {
	const { articleId } = req.body;
	const db = await prepareConnection();
	const articlesRepo = db.getRepository(Articles);

	const article = await articlesRepo.findOne({id: articleId})
	let responseData: IResponse<IComment[]> = {code: 0, msg: '查询成功。。。'};
	if (article) {
		console.log('article: ', article);
		const commentsRepo = db.getRepository(Comments);
		const comments = await commentsRepo.find({where: { ['article_id']: articleId }, relations: ['user']});
		console.log('comments: ', comments);
		if (comments) {
			responseData.data = comments;
		} else {
			responseData = EXCEPTION_COMMENT.QUERY_EMPTY;
		}

	} else {
		responseData = EXCEPTION_ARTICLE.NOT_FOUND;
	}

	res.status(200).send(responseData);
}

export default query;
