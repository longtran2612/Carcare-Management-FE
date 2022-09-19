import React from "react";
import { Breadcrumb } from "antd";

const Breadcrumb = () => {
  return (
    <Breadcrumb style={{ margin: "16px 15px" }}>
      <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
      <Breadcrumb.Item>Khách hàng</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default Breadcrumb;
