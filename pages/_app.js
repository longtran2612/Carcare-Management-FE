import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import store from "../redux/store";
import { Provider } from "react-redux";
import { Fragment } from "react";
import Head from "next/head";
import Header from "components/Header";
import Footer from "components/Footer";
import Loading from "components/Loading";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // const [loading, setLoading] = useState(false);
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
          <div className="body">
            {/* <Header/> */}
            {/* <Loading /> */}
            <Component {...pageProps} />
            {/* <Footer/> */}
          </div>
        </Provider>
      </SessionProvider>
    </Fragment>
  );
}

export default MyApp;
