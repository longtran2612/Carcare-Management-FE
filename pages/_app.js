import "../styles/style.css"
import "../styles/globals.css";
import "../styles/style.scss";
import "../styles/service.scss";
import "../styles/carslot.scss";
import "antd/dist/antd.css";
import "../styles/bootstrap.css";


import store from "../redux/store";
import { Provider } from "react-redux";
import { Fragment } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover width=device-width, initial-scale=1"
        />
         <link rel="icon" href="/images/favicon.ico" />
      </Head>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
    </Fragment>
  );
}

export default MyApp;
