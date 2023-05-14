import { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';

const TIMEOUT_LIMITATION = 60;

const CountDown = () => {
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
    setIsShowVerifyCode(true);
  };

  return isShowVerifyCode ? (
    <Button type='text'>{restTime} 秒</Button>
    ) : (
    <Button onClick={handleSendVerifyCode}>获取验证码</Button>
  );
};

export default CountDown;
