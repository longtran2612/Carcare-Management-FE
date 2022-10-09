import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import MyHeader from "components/Header";
import MyFooter from "components/Footer";
const { Content } = Layout;
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Features } from "components-customer/features";
import { CustomerHeader } from "components-customer/header";
import { About } from "components-customer/about";
import { Services } from "components-customer/services";
import JsonData from "data/data.json";

function HomePage() {
  const router = useRouter();

  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <MyHeader />
        <Content>
          <CustomerHeader data={landingPageData.Header} />
          <Features data={landingPageData.Features} />
          <Services data={landingPageData.Services} />
          <About data={landingPageData.About} />
        </Content>
        <MyFooter />
      </Layout>
    </>
  );
}

export default HomePage;
