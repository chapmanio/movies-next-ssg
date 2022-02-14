import type { AppProps } from 'next/app';

import { UserProvider } from '../hooks/useUser';
import { ListProvider } from '../hooks/useList';
import { ListModalProvider } from '../hooks/useListModal';

import ListModal from '../components/lists/ListModal';

import '../styles/globals.css';

const MoviesApp = ({ Component, pageProps }: AppProps) => {
  // Render
  return (
    <UserProvider>
      <ListProvider>
        <ListModalProvider>
          <Component {...pageProps} />

          <ListModal />
        </ListModalProvider>
      </ListProvider>
    </UserProvider>
  );
};

export default MoviesApp;
