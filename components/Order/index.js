import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import OrderTable from "./OrderTable";

const OrderPage = () => {
  return (
    <>
     <Breadcrumb style={{ margin: "10px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Quản lý hóa đơn</Breadcrumb.Item>
      </Breadcrumb>
      <OrderTable />
    </>
  );
};
export default OrderPage;
