import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { Tags } from 'db/entity';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.session;
  const db = await prepareConnection();
  const TagRepo = db.getRepository(Tags);

  const followTags = await TagRepo.find({
    where: (qb: any) => {qb.where('user_id = :id', { id: Number(id) })},
    relations: ['users']
  });

  console.log('followTags: ', followTags);
  const allTags = await TagRepo.find();

  res.status(200).json({code: 0, data: {followTags, allTags}});
}

export default withIronSessionApiRoute(get, ironOptions);