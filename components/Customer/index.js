import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import CustomerTable from "./CustomerTable";

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

      <CustomerTable />
    </>
  );
};
export default CustomerPage;