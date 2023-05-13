import { useState } from 'react';
import type { NextPage } from 'Next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { navs } from './config';

import Login from 'components/Login';

import styles from './index.module.scss';

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGoToEditorPage = () => {};
  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
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
        <Button onClick={handleGoToEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
