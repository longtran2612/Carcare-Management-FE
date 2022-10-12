import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {/* <!-- font Open --> */}
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          {/* <!-- css he thong --> */}
          <link
            rel="stylesheet"
            type="text/css"
            href="/skins/bootstrap.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/skins/animate.css" />
          <link
            rel="stylesheet"
            type="text/css"
            href="/skins/fontawesome.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/skins/font-awesome.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          />
          
        </Head>
        <body>
          <Main />
          <NextScript />
          <script type="text/javascript" src="/js/jquery.min.js"></script>
          <script type="text/javascript" src="/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/js/owl.carousel.min.js"></script>
          <script type="text/javascript" src="/js/swiper.min.js"></script>
          <script
            type="text/javascript"
            src="/js/jquery.countdown.min.js"
          ></script>
          <script type="text/javascript" src="/js/wow.min.js"></script>
          <script type="text/javascript" src="/js/library.js"></script>
        </body>
      </Html>
    );
  }
}
export default MyDocument;
