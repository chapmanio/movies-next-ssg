import type { AppProps } from 'next/app';

import '../styles/globals.css';

function Movies({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default Movies;
