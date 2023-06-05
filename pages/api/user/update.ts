import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import prepareConnection from 'db/index';
import { User } from 'db/entity';
import type { ISession, IUser } from 'type/index';

import { EXCEPTION_USER } from '../config/codes';

async function userDetail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { nickname, job, introduce } = req.body;

  const db = await prepareConnection();
  const usersRepo = db.getRepository(User);
  let user: IUser|undefined = await usersRepo.findOne({where: { id: session.id }});

  if (user) {

    user = { ...user, nickname, job, introduce };
    const newUser = await usersRepo.save(user);
    res.status(200).json({
      code: 0,
      msg: '',
      data: {userInfo: newUser}
    });
  } else {
    res.status(200).json(EXCEPTION_USER.NOT_FOUND);
  }

}

export default withIronSessionApiRoute(userDetail, ironOptions);
