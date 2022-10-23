import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PromotionHeaderTable from "./PromotionHeaderTable";

const PromotionHeaderPage = () => {
  return (
    <>
  <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Quản lý chương trình khuyến mãi</Breadcrumb.Item>
      </Breadcrumb>
      <PromotionHeaderTable />
    </>
  );
};
export default PromotionHeaderPage;
