import type { NextPage } from 'Next';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const Layout: NextPage = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
