import React from "react";
import PriceHeaderTable from "./PriceHeaderTable";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const PriceHeaderPage = () => {
  return (
    <>
     <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Quản lý bảng giá</Breadcrumb.Item>
      </Breadcrumb>
      <PriceHeaderTable />
    </>
  );
};
export default PriceHeaderPage;
