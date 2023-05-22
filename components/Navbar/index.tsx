import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'Next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Dropdown, Avatar, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { navs } from './config';
import request from 'service/fetch';
import { useStore } from 'store/index';

import Login from 'components/Login';

import styles from './index.module.scss';

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };

   const handleGotoPersonalPage = () => {
    if (userId) {
      push(`/user/${userId}`);
    } else {
      message.warning('请先登录');
    }

   };

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
        push('/');
      }
    });
  };

  const handleMenuClick = ({key}: { key: string}) => {
    if (key === '1') {
      handleGotoPersonalPage();
    } else if (key === '2') {
      handleLogout();
    }
  }

  const menuProps = {
    items: [
      {
        label: '个人主页',
        key: '1',
        icon: <HomeOutlined />,
      },{
        label: '退出系统',
        key: '2',
        icon: <LoginOutlined />,
      }],
      onClick: handleMenuClick
    };

  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav.label} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage} className={`userId ? ${styles.hide}: ''`}>写文章</Button>
        {userId ? (
          <>
            <Dropdown menu={menuProps} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);;
