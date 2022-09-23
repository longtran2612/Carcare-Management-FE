import {
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  DollarOutlined,
  ShopOutlined,
  CarOutlined,
  BorderOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { Typography } from "antd";
import React, { useState } from "react";
const { Title } = Typography;
import { useRouter } from "next/router";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Cửa hàng", "shop", <ShopOutlined />),
  getItem("Hóa đơn", "2", <BorderOutlined />, [
    getItem("Tạo mới hóa đơn", "order-create"),
    getItem("Danh sách hóa đơn", "order-list"),
  ]),

  getItem("Dịch vụ", "3", <CarOutlined />, [
    getItem("Danh mục", "category"),
    getItem("Dịch vụ", "service"),
  ]),
  getItem("Bảng giá", "4", <DollarOutlined />, [getItem("bảng giá", "price")]),
  getItem("Xe", "5", <CarOutlined />, [
    getItem("Xe khách hàng", "car-model"),
    getItem("Mẫu xe", "car"),
  ]),
  getItem("Người dùng", "6", <UserOutlined />, [
    getItem("Người dùng", "user"),
    getItem("Khách hàng", "customer"),
    getItem("Nhóm người dùng", "customer-group"),
  ]),
  getItem("Trương trình khuyến mãi", "7", <TagsOutlined />, [
    getItem("Trương trình khuyến mãi", "promotion"),
  ]),
  getItem("Thống kê - Báo cáo", "8", <BarChartOutlined />, [
    getItem("Doanh số", "sell-report"),
    getItem("Lợi nhuận", "income"),
  ]),
];

const rootSubmenuKeys = [
  "order",
  "service",
  "product",
  "customer",
  "promotion",
  "report",
];

const SideBar = ({ handleOpenKey }) => {
  const router = useRouter();

  const onClick = ({ item, key, keyPath, domEvent }) => {
    console.log({ item, key, keyPath, domEvent });
    handleOpenKey(key);
  };

  return (
    <div>
      <div className="logo" >
        <Title className="textAlign" style={{height: '53px',  backgroundColor: "#C7E5F4",boxShadow: " 0 4px 4px -2px #D0EDF3"}}  level={5}>Dashboard</Title>
      </div>
      <Menu
        mode="inline"
        style={{ height: "100%" }}
        theme="light"
        items={items}
        onClick={onClick}
        defaultSelectedKeys={["shop"]}
      />
    </div>
  );
};

export default SideBar;
