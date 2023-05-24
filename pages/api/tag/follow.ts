import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { Tags, User } from 'db/entity';

const follow = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.session;
	const { type, tagId } = req.body;
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tags);
	
  const tag = await tagRepo.findOne({where: {id: tagId}, relations: ['users']});
	console.log('tag: ', tag);
	
	let responseData = {code: 1, data: {}, msg: '用户不存在。。。'};
	if (tag?.users) {
		const userRepo = db.getRepository(User);
		const user = await userRepo.findOne({where: {id: id}})
		console.log('user: ', user);

		if (type === 'unfollow') {
			tag.users = tag.users.filter(u => u.id !== id);
		} else if (tag.users.some(u => u.id ===id)) {
			res.status(200).json({ ...responseData, code: 1, msg: '已关注'});
			
			return;
		} else if (type === 'follow') {
			tag.users = tag.users.concat([user]);
		}

		tag['follow_count'] = tag.users.length;

		const resTag = await tagRepo.save(tag);
		responseData = { ...responseData, code: 0, data: resTag, msg: ''}
	}

  res.status(200).json(responseData);
}

export default withIronSessionApiRoute(follow, ironOptions);