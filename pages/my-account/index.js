import React from "react";
import { Tabs, Layout } from "antd";
import { CustomerNavigation } from "components-customer/navigation";
import { UserOutlined, LockOutlined, ClearOutlined } from "@ant-design/icons";
import { ProfileCustomer } from "components-customer/Profile";
import ChangePassword from "components-customer/ChangePassword/ChangePassword";
import BillCustomer  from "components-customer/bill";

const MyAccountPage = () => {
  const onChange = (key) => {};

  return (
    <>
      <CustomerNavigation />
      <div className="content">
        <Layout.Content
          style={{
            paddingTop: "4rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            minHeight: "100vh",
          }}
        >
          <Tabs style={{margin:"1rem",padding:"2rem", minHeight:'60vh',background:"white" ,borderRadius:"5px"}} >
            <Tabs.TabPane tab="Thông tin cá nhân" key="item-1">
              <ProfileCustomer />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Dịch vụ đang sử dụng" key="item-2">
              Content 2
            </Tabs.TabPane>
            <Tabs.TabPane tab="Lịch sử thanh toán" key="item-3">
             <BillCustomer/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thay đổi mật khẩu" key="item-4">
              <ChangePassword/>
            </Tabs.TabPane>
          </Tabs>
        </Layout.Content>
      </div>
      ;
    </>
  );
};

export default MyAccountPage;
