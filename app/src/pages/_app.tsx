import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";



import "../../styles/styles.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);