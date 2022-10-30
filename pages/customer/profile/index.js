import React, { useState } from "react";
import { Tabs, Layout, Button } from "antd";
import { ProfileCustomer } from "components-customer/Profile";
import ChangePassword from "components-customer/ChangePassword";

import { CustomerNavigation } from "components-customer/navigation";
import Loading from "components/Loading";
import { useRouter } from 'next/router'

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  return (
    <>
      <CustomerNavigation />
      <Layout.Content
        style={{
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <Button type="primary" onClick={()=>router.back()}>
          Trở về
        </Button>
        <Tabs
          defaultActiveKey={1}
          style={{
            margin: "1rem",
            padding: "2rem",
            minHeight: "80vh",
            background: "white",
            borderRadius: "5px",
          }}
        >
          <Tabs.items tab="Thông tin cá nhân" key="1">
            <ProfileCustomer />
          </Tabs.items>
          <Tabs.items tab="Đổi mật khẩu" key="2">
          <ChangePassword />
          </Tabs.items>
        </Tabs>
      </Layout.Content>
      <Loading loading={loading} />
    </>
  );
}
