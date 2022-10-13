import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
// import UserTable from "./UserTable";

const CustomerPage = () => {
  return (
    <>
      <Breadcrumb style={{ margin: "10px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <UserOutlined />
          Quản lý khách hàng
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* <UserTable /> */}
    </>
  );
};
export default CustomerPage;
