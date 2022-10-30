import React from "react";
import { Tabs, Layout } from "antd";
import { CustomerNavigation } from "components-customer/navigation";
import { UserOutlined, LockOutlined, ClearOutlined } from "@ant-design/icons";
import { ProfileCustomer } from "components-customer/Profile";
import ChangePassword from "components-customer/ChangePassword/index.js";
import BillCustomer from "components-customer/bill";
import ServiceCustomer from "components-customer/Service";
import { useRouter } from "next/router";
import { useState,useEffect } from "react";
import Loading from "components/Loading";
import Cookies from "js-cookie";
const MyAccountPage = () => {
  const [active, setActive] = useState();
  const [loading, setLoading] = useState(false);
  const onChange = (key) => {
    setActive(key);

  };
  const router = useRouter();
  const { key } = router.query;
  const handleAccess = async () => {
    setLoading(true);
    let accessToken = Cookies.get("accessToken");
    if (accessToken == null) {
      router.push("/login");
      setLoading(false);
      return;
    }
    setLoading(false);
  }

  useEffect(() => {
    handleAccess();
    if (key) {
      onChange(key);
    }
  }, [key]);
  return (
    <>
      <CustomerNavigation />
      <Layout.Content
        style={{
          paddingTop: "5rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          minHeight: "95vh",
          backgroundColor: "#E3E2E2",
        }}
      >
        <Tabs
          defaultActiveKey={key}
          style={{
            margin: "1rem",
            padding: "2rem",
            minHeight: "80vh",
            background: "white",
            borderRadius: "5px",
          }}
          onChange={onChange}
          accessKey={active}
        >
          <Tabs.items tab="Thông tin cá nhân" key="1">
            <ProfileCustomer />
          </Tabs.items>
          <Tabs.items tab="Dịch vụ đang sử dụng" key="2">
            <ServiceCustomer />
          </Tabs.items>
          <Tabs.items tab="Lịch sử thanh toán" key="3">
            <BillCustomer />
          </Tabs.items>
          <Tabs.items tab="Thay đổi mật khẩu" key="4">
            <ChangePassword />
          </Tabs.items>
        </Tabs>
      </Layout.Content>
      ;
      <Loading loading={loading} />
    </>
  );
};

export default MyAccountPage;
