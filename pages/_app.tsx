import { StoreProvider } from 'store/index';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';

import '../styles/globals.css';

interface IProps extends AppProps {
  initialValue: Record<string, any>;
};

function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: any) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies||{};
  console.log('ctx?.req.cookie: ', ctx?.req?.cookies);

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
}

export default MyApp;
