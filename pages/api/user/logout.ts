import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';

import { ISession } from 'pages/api/index';

import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req,res);

  session.destroy();
  setCookie(cookies, { expiresDate: new Date() });

  res.status(200).json({
    code: 0,
    msg: '退出成功...',
  });
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);
