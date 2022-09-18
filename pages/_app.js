import "../styles/globals.css";
import "../styles/style.scss"
import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import store from "../redux/store";
import { Provider } from "react-redux";
import { Fragment } from "react";
import Head from "next/head";


// import "react-phone-input-2/dist/style.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <SessionProvider session={session}>
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
      </SessionProvider>
    </Fragment>
  );
}

export default MyApp;
