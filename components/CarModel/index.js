import React from "react";
import CarModelTable from "./CarModelTable";
import { Breadcrumb } from "antd";
import { HomeOutlined,CarOutlined } from "@ant-design/icons";
const CarModelPage = () => {
  return (
    <>
       <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <CarOutlined />
         {" "} Quản lý mẫu xe
        </Breadcrumb.Item>
      </Breadcrumb>
      <CarModelTable />
    </>
  );
};
export default CarModelPage;
