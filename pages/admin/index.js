import { Affix, Col, Layout, Row, Space, Typography } from "antd";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
import { loadUser } from "pages/api/authAPI";
import logo from "public/images/logo.png";
import Image from "next/image";
const { Content, Sider, Footer } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("car-slot");

  const router = useRouter();

  const handleAuthentication = async () => {
    let accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    if (accessToken == null) {
      router.push("/login");
      return;
    }
    try {
      loadUser().then((res) => {
        console.log("res:", res);
        if (res.data.StatusCode == 200) {
          if (res.data.Data.roles == "ROLE_ADMIN") {
            router.push("/admin");
          } else {
            router.push("/home");
          }
        } else {
          if (res.data.StatusCode == 400) {
            message.error(res.message);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleAuthentication();
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
   
        <Sider
          className="site-layout-background"
          collapsible
          onCollapse={(value) => setCollapsed(value)}
          collapsed={collapsed}
          theme="light"
          style={
            {
              left: 0,
              top: 0,
              bottom: 0,
            }
          }
        >
          <Affix style={{  top: 0, left: 0 }} >

          <SideBar collapsed={collapsed} handleOpenKey={(key) => setKey(key)} />
          </Affix>

        </Sider>
      <Layout className="site-layout">
        <MyHeader />
        <Content
          className="site-layout-background"
          style={{
            margin: "5px 5px",
            padding: 10,
            minHeight: 500,
            backgroundColor: "#FBE6FF",
          }}
        >
          <MyContent
            style={{ margin: "24px 16px 0", overflow: "initial" }}
            keyMenu={key}
          />
        </Content>
        <Footer style={{ backgroundColor: "white", textAlign: "center" }}>
          <Row justify="center">
            <Image width={100} height={100} src={logo} alt="logo" />
            <Space />
            <Typography.Title
              level={4}
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#1890ff",
              }}
            >
              ©2022 Coppy right by VL-CARCARE
            </Typography.Title>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
