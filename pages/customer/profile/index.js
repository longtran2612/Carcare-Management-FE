import React, { useState } from "react";
import { Tabs, Layout, Button, Col, Row } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { ProfileCustomer } from "components-customer/Profile";
import ChangePassword from "components-customer/ChangePassword";

import { CustomerNavigation } from "components-customer/navigation";
import Loading from "components/Loading";
import { useRouter } from "next/router";

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <CustomerNavigation />
      <Layout.Content
        style={{
          padding:'1rem',
          backgroundColor: "#EAE3E3",
        }}
      >
        <Row>
          <Col style={{borderRadius: "5px",backgroundColor:"white"}} span={24}>
          <Button
          type="dashed" 
              style={{
                paddingLeft: "20px",
                marginTop: "10px",
                marginLeft: "15px",
              }}
              onClick={() => router.back()}
              icon={<RollbackOutlined />}
            >
              Trở lại
            </Button>
            <div
              style={{
                margin: "0.4rem",
                padding: "1.5rem",
                minHeight: "75vh",
                
              }}
              
            >
              <Tabs defaultActiveKey={1}>
                <Tabs.items tab="Thông tin cá nhân" key="1">
                  <ProfileCustomer />
                </Tabs.items>
                <Tabs.items tab="Đổi mật khẩu" key="2">
                  <ChangePassword />
                </Tabs.items>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Layout.Content>
      <Loading loading={loading} />
    </>
  );
}
