import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import OrderNotRequestTable from "./OrderNotRequestTable";

const OrderNotRequestPage = () => {
  return (
    <>
     <Breadcrumb style={{ margin: "10px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Quản lý hóa đơn</Breadcrumb.Item>
      </Breadcrumb>
      <OrderNotRequestTable />
    </>
  );
};
export default OrderNotRequestPage;
