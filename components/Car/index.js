import React from "react";
import CarTable from "./CarTable";
import { Breadcrumb } from "antd";
import { HomeOutlined, CarOutlined } from "@ant-design/icons";

const CarPage = () => {
  return (
    <>
  <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <CarOutlined />
          <span>Quản lý xe</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <CarTable />
    </>
  );
};
export default CarPage;
