import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { User } from 'db/entity';
import type { ISession } from 'type/index';

async function userDetail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;

  const db = await prepareConnection();
  const users = db.getRepository(User);
  const user = await users.findOne({where: { id: session.id }});

  console.log(user, '====');

  res.status(200).json({
    code: 0,
    msg: '',
    data: {userInfo: user}
  });
}

export default withIronSessionApiRoute(userDetail, ironOptions);
