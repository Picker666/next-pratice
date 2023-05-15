import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOptions } from 'config/index';

import prepareConnection from 'db/index';
import { User, UserAuth } from 'db/entity';

import { ISession } from 'pages/api/index';

import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone, verifyCode, identity_type } = req.body;
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  console.log('session: ', session);

  console.log('phone, verifyCode: ', phone, verifyCode);
  const db = await prepareConnection();

  const userAuthRepo = db.getRepository(UserAuth);

  const responseData = {code: 0};

  if (String(session[phone]) === String(verifyCode)) {
    let userAuth = await userAuthRepo.findOne(
      { identifier: phone, identity_type },
      { relations: ['user'] }
    );

    if (userAuth) {
      const { nickname, id, avatar } = userAuth.user;

      session.nickname = nickname;
      session.avatar = avatar;
      session.id = id;

      console.log('session: ', session);

      // session[phone] = undefined;
      await session.save();
      setCookie(cookies, {userId: id, nickname, avatar});

      responseData.msg = '登录成功。。。';
    } else {
      const user = new User();

      user.nickname = `用户_${phone}`;
      user.avatar = '/images/avatar.webp';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.credential = session.verifyCode;
      userAuth.identity_type = identity_type;
      userAuth.user = user;

      const newUserAuth = await userAuthRepo.save(userAuth);

      const { nickname, id, avatar } = newUserAuth.user;

      session.nickname = nickname;
      session.avatar = avatar;
      session.id = id;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });

      responseData.msg = '已为你创建新用户，并登录成功。。。';
    }
  } else {
    responseData.code = -1;
    responseData.msg = '验证码错误。。。';
  }


  res.status(200).json(responseData);
}

export default withIronSessionApiRoute(login, ironOptions);
