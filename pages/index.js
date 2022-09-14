import { Breadcrumb, Layout } from "antd";
import React, { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import MyHeader from "components/Header";
import SideBar from "components/SideBar";
import MyContent from "components/Content";
import { loadUser } from "api/authAPI";
const { Content, Sider, Footer } = Layout;


const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState(1);

  const router = useRouter();

  
  const handleAuthentication = async () => {

    let accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    if (accessToken == null) {
      router.push("/login");
      return
    }
    try{
     loadUser().then((res) => {
      console.log("res:", res);
      if (res.data.status == 1) {
      } else {
        if (res.status == 400) {
          message.error(res.message);
        }
      }
    }

        )
     
    }catch(err){
      console.log(err)

    }
  }
  useEffect(() => {
    handleAuthentication()
  }, []);
  
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
