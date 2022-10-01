import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";

const CategoryPage = () => {
  return (
    <>
      <Breadcrumb style={{ margin: "10px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Danh mục dịch vụ</Breadcrumb.Item>
      </Breadcrumb>
      <CategoryTable />
    </>
  );
};
export default CategoryPage;
