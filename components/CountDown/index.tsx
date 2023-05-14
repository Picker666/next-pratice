import { useState, useRef, useEffect } from 'react';
import { Button, FormInstance, message } from 'antd';
import request from 'service/fetch'

const TIMEOUT_LIMITATION = 60;

const CountDown = (props: {form: FormInstance}) => {
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [restTime, setRestTime] = useState(TIMEOUT_LIMITATION);
  const timeoutRef = useRef<null|NodeJS.Timeout>(null);

  useEffect(() => {
    if (!isShowVerifyCode) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      if (restTime === 0) {
        setIsShowVerifyCode(false);
        setRestTime(TIMEOUT_LIMITATION);
        timeoutRef.current && clearTimeout(timeoutRef.current);
      } else {
        setRestTime(restTime - 1);
      }
    }, 1000);
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [restTime, isShowVerifyCode]);

  const handleSendVerifyCode = () => {
    const phone = props.form.getFieldValue('phone');
    if (!phone) {
      message.error('请输入手机号。。。');

      return;
    }
    request.post('/api/user/sendVerifyCode', {
      to: phone,
      templateId: 1
    }).then((res: any) => {
      if (res.code === 0) {
        setIsShowVerifyCode(true);

      } else {
        message.error(res?.msg || '未知错误')
      }
    });
  };

  return isShowVerifyCode ? (
    <Button type='text'>{restTime} 秒后发送</Button>
    ) : (
    <Button onClick={handleSendVerifyCode}>获取验证码</Button>
  );
};

export default CountDown;
