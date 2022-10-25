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
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          />
      
        </Head>
        <body>
          <Main />
          <NextScript />
          // public/index.html
          <script
            crossorigin
            src="https://unpkg.com/react@17/umd/react.production.min.js"
          ></script>
          <script
            crossorigin
            src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
          ></script>
          // According to the need to introduce
          <script
            type="text/javascript"
            src="https://unpkg.com/@ant-design/plots@latest/dist/plots.min.js"
          ></script>
          // Plots
          <script
            type="text/javascript"
            src="https://unpkg.com/@ant-design/plots@latest/dist/plots.min.js"
          ></script>
          // Flowchart
          <script
            type="text/javascript"
            src="https://unpkg.com/@ant-design/flowchart@latest/dist/flowchart.min.js"
          ></script>
          // Maps
          <script
            type="text/javascript"
            src="https://unpkg.com/@ant-design/maps@latest/dist/maps.min.js"
          ></script>
          // Graphs
          <script
            type="text/javascript"
            src="https://unpkg.com/@ant-design/graphs@latest/dist/graphs.min.js"
          ></script>
        </body>
      </Html>
    );
  }
}
export default MyDocument;
