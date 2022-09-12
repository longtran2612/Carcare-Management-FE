// import {
//   DesktopOutlined,
//   FileOutlined,
//   PieChartOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import React, { useState } from "react";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
const { Content, Sider, Footer } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState(1);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          overflow: "auto",
        }}
      >
        <SideBar collapsed={collapsed} handleOpenKey={(key) => setKey(key)} />
      </Sider>
      <Layout className="site-layout">
        <MyHeader />
        <Breadcrumb style={{ margin: "16px 15px" }}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
        </Breadcrumb>
        <MyContent keyMenu={key} />
        {/* <Footer /> */}
        <Footer style={{ textAlign: "center" }}>
          ©2022 Coppy right by VLCARSERVICE
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
