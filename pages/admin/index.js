import { Col, Layout, Row, Typography } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
import { loadUser } from "pages/api/authAPI";
import logo from "public/images/logo.svg";
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
        style={{
          height: "100vh",
        
          maxHeight: "1000vh",
          overflow: "auto",
        }}
      >
        <SideBar style={{  position: "fixed"}} collapsed={collapsed} handleOpenKey={(key) => setKey(key)} />
      </Sider>
      <Layout className="site-layout">
        <MyHeader />
        <MyContent  keyMenu={key} />
        <Footer style={{ backgroundColor: "white", textAlign: "center" }}>
          <Row justify="center">
            <Image width={100} height={100} src={logo} alt="logo" />
            <Typography.Title level={4} style={{textAlign:"center", color: "#1890ff" }}>
            ©2022 Coppy right by VL-CARCARE
      </Typography.Title>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
