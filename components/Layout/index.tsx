import type { NextPage } from 'Next';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import styles from './index.module.scss';

const Layout: NextPage = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Navbar />
      </div>
      <main className={styles.content}>{children}</main>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
