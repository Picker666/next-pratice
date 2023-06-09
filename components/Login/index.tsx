import type { NextPage } from 'next';
import { useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, Checkbox, message } from 'antd';
import { useCookie, withCookie } from 'next-cookie';

import CountDown from 'components/CountDown';

import request from 'service/fetch'
import { useStore } from 'store/index';

import styles from './index.module.scss';

interface IProps {
  isShow: boolean;
  onClose: () => void;
  cookie?: any;
}

/**
 * 获取cookie的方式，通过 withCookie 或者 getInitialProps + useCookie(cookies) 都可以，
 */

const Login = withCookie((props: Pick<IProps, 'onClose' | 'cookie'>) => {
  const { onClose, cookie } = props;
  // const cookie = useCookie(cookies);
  const store = useStore();

  const [form] = Form.useForm();

  const handleGithubLogin = () => {
    console.log("===============");
  };

  useEffect(() => {
    form.setFieldsValue({
      phone: '17621059030',
      agreement: true
    });
  }, []);

  const onFinish = (values: { [key: string]: string }) => {
    const { phone, verifyCode } = values;
    request
      .post('/api/user/login', { phone, verifyCode, identity_type: 'phone' })
      .then((response: any) => {
        if (response?.code === 0) {
          store.user.setUserInfo({
            userId: cookie.get('userId'),
            nickname: cookie.get('nickname'),
            avatar: cookie.get('avatar'),
          });
          onClose();
        } else {
          message.error(response?.msg || '登录失败');
        }
      });
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={false}
      centered
      maskClosable={false}
      width={'480px'}
    >
      <div className={styles.container}>
        <div className={styles.title}>手机号登录</div>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, message: '请输入手机号!' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item label="验证码">
            <Row gutter={8}>
              <Col span={14}>
                <Form.Item
                  name="verifyCode"
                  noStyle
                  rules={[
                    { required: true, message: '请输入验证码。。。' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        }
                        if (value.length > 4) {
                          return Promise.reject(
                            new Error('请输入正确的验证码。。。')
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="请输入验证码。。。" />
                </Form.Item>
              </Col>
              <Col span={9}>
                <CountDown form={form} />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

          <div className={styles.otherLogin} onClick={handleGithubLogin}>
            使用 Github 登录
          </div>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            wrapperCol={{ offset: 3, span: 16 }}
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Should accept agreement')),
              },
            ]}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
});

// Login.getInitialProps = async ({ ctx }: any) => {
//   const { userId, nickname, avatar } = ctx?.req.cookies || {};

//   return {
//     props: {
//       cookies: ctx?.req.cookies,
//     },
//   };
// };

const LoginWrapper = (props: IProps)=>{
  const { isShow, onClose } = props;

  if (isShow) {
    return  <Login onClose={onClose} />;
  }
  return null;

};

export default LoginWrapper;
