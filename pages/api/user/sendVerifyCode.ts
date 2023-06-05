import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ironOptions } from 'config/index';

import { ISession } from 'type/index';

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const { to = '', templateId = '1' } = req.body;
  const session: ISession = req.session;

  const AccountId = '2c94811c87fb7ec601881864fe4809bf';
  const AuthToken = '714f025e451744e99e7905deae74701b';
  const nowDate = format(new Date(), 'yyyyMMddHHmmss');
  const AppId = '2c94811c87fb7ec601881864ff7d09c6';

  const SigParameter = md5(`${AccountId}${AuthToken}${nowDate}`);
  const Authorization = encode(`${AccountId}:${nowDate}`);

  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;
  const verifyCode = String(Math.floor(Math.random()*9000) + 1000);
  const expireDate = 5;

  try {

    const response = await request.post(
      url,
      {
        to,
        templateId,
        appId: AppId,
        datas: [verifyCode, expireDate],
      },
      {
        headers: {
          Authorization,
        },
      }
      );

    console.log('response: ', response);
    const { statusCode, statusMsg, templateSMS } = response as unknown as { statusCode: string, statusMsg: string; templateSMS: Record<string, any>};

    if (statusCode === '000000') {
      session[to] = verifyCode;
      await session.save();
  
      res.status(200).json({
        code: 0,
        msg: statusMsg,
        data: templateSMS
      });
    } else {
      res.status(200).json({
        code: statusCode,
        msg: statusMsg,
      });
    }
  } catch (err) {
    res.status(200).json({
      code: -1,
      msg: '网络异常。。。',
    })
  }
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)