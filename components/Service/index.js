import React from "react";
import ServiceTable from "./ServiceTable";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
const ServicePage = () => {
  return (
    <>
   <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href=""> {" "}Quản lý dịch vụ</Breadcrumb.Item>
      </Breadcrumb>
      <ServiceTable />
    </>
  );
};
export default ServicePage;
