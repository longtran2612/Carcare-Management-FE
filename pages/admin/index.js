import { Affix, Col, Layout, Row, Space, Typography } from "antd";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
import { loadUser } from "pages/api/authAPI";
import Loading from "components/Loading";
const { Content, Sider, Footer } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("car-slot");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAuthentication = async () => {
    setLoading(true);
    let accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    if (accessToken == null) {
      router.push("/login");
      setLoading(false);
      return;
    }
    try {
      // loadUser().then((res) => {
      //   console.log("res:", res);
      //   if (res.data.StatusCode == 200) {
      //     if (res.data.Data.roles == "ROLE_USER" || res.data.Data.roles == "ROLE_ADMIN") {
      //       router.push("/admin");
      //     } else {
      //       router.push("/home");
      //     }
      //   } else {
      //     if (res.data.StatusCode == 400) {
      //       message.error(res.message);
      //     }
      //   }
      //   setLoading(false);
      // });
      const res = await loadUser();
      const roles = Cookies.get("roles");
      if (roles == "ROLE_USER" || roles == "ROLE_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleAuthentication();
  }, []);

  return (
    <>
      <Layout
        style={{
          minHeight: "70vh",
        }}
      >
        <Sider
          className="site-layout-background"
          // collapsible
          // onCollapse={(value) => setCollapsed(value)}
          theme="dark"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {/* <Affix style={{ top: 0, left: 0 }}> */}
          <SideBar
            // collapsed={collapsed}
            handleOpenKey={(key) => setKey(key)}
          />
          {/* </Affix> */}
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
          }}
          className="site-layout"
        >
          <Affix style={{ top: 0, left: 0 }}>
            <MyHeader />
          </Affix>
          <Content
            className="site-layout-background content"
            style={{
              minHeight: "80vh",
            }}
          >
            <MyContent keyMenu={key} />
          </Content>
          {/* <Footer style={{ backgroundColor: "white", textAlign: "center" }}>
            <Row justify="center">©2022 Coppy right by VL-CARCARE</Row>
          </Footer> */}
        </Layout>
      </Layout>
      <Loading loading={loading} />
    </>
  );
};

export default AdminPage;
