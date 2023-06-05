import { StoreProvider } from 'store/index';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';

import '../styles/globals.css';

interface IProps extends AppProps {
  initialValue: Record<string, any>;
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderComponent = (
    Component: any,
    pageProps: AppProps['pageProps']) => {
    if (Component?.layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <StoreProvider initialValue={initialValue}>
      {renderComponent(Component, pageProps)}
    </StoreProvider>
  );
}

export async function getServerSideProps ({ ctx }: any) {
  const { userId, nickname, avatar } = ctx?.req?.cookies||{};

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
