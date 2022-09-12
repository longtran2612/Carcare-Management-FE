import {
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  CarOutlined,
  BorderOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Typography } from "antd";
import React, { useState } from "react";
import Link from "next/link";
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
  getItem("Cửa hàng", "1", <ShopOutlined />),
  getItem("Hóa đơn", "2", <BorderOutlined />, [
    getItem("Tạo mới hóa đơn", "order-create"),
    getItem("Danh sách hóa đơn", "order-list"),
  ]),

  getItem("Dịch vụ", "3", <CarOutlined />, [
    getItem("danh mục dịch vụ", "service-category"),
    getItem("dịch vụ", "service"),
    getItem("bảng giá", "priceService"),
  ]),
  getItem("Sản phẩm", "4", <DropboxOutlined />, [
    getItem("danh mục sản phẩm", "product-category"),
    getItem("Sản phẩm", "product"),
    getItem("bảng giá", "priceProduct"),
  ]),
  getItem("Quản lý xe", "5", <CarOutlined />, [
    getItem("Xe", "car-model"),
    getItem("Xe khách hàng", "customer-car"),
  ]),
  getItem("Quản lý người dùng", "user", <UserOutlined />, [
    getItem("Người dùng", "user"),
    getItem("Khách hàng", "customer"),
    getItem("Nhóm khách hàng", "customer-group"),
  ]),
  getItem("Quản lý trương trình khuyến mãi", "7", <TagsOutlined />, [
    getItem("Danh sách trương trình khuyến mãi", "promotion"),
  ]),
  getItem("Thống kê - Báo cáo", "8", <BarChartOutlined />, [
    getItem("Bán hàng - Trả hàng", "sell-report"),
    getItem("Lợi nhuận - Doanh thu", "income"),
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

  // const onOpenChange = (keys) => {
  //   const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

  //   if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(keys);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };

  // const onSelect = (selected) => {
  //   router.push(`/${selected.key}`);
  //   console.log(selected);
  // };

  const onClick = ({ key }) => {
    handleOpenKey(key);
  };

  return (
    <div>
      <div className="logo">
        <Title level={5}>Dashboard</Title>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        // openKeys={openKeys}
        items={items}
        // onSelect={onSelect}
        onClick={onClick}
        defaultSelectedKeys={["1"]}
      />
    </div>
  );
};

export default SideBar;
