import type { AppProps } from 'next/app';
import Head from 'next/head';

import { UserProvider } from '../hooks/useUser';
import { ListProvider } from '../hooks/useList';
import { ListModalProvider } from '../hooks/useListModal';

import ListModal from '../components/lists/ListModal';

import '../styles/globals.css';

const MoviesApp = ({ Component, pageProps }: AppProps) => {
  // Render
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <UserProvider>
        <ListProvider>
          <ListModalProvider>
            <Component {...pageProps} />

            <ListModal />
          </ListModalProvider>
        </ListProvider>
      </UserProvider>
    </>
  );
};

export default MoviesApp;
