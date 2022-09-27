import {
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  DollarOutlined,
  ShopOutlined,
  CarOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Typography } from "antd";
import React, { useState } from "react";
const { Title } = Typography;
import { useRouter } from "next/router";
import logo from "public/images/logo.svg";
import Image from "next/image";

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
  getItem("Cửa hàng", "car-slot", <ShopOutlined />),
  getItem("Hóa đơn", "2", <BorderOutlined />, [
    getItem("Tạo mới hóa đơn", "order-create"),
    getItem("Danh sách hóa đơn", "order-list"),
  ]),

  getItem("Dịch vụ", "3", <CarOutlined />, [
    getItem("Danh mục", "category"),
    getItem("Dịch vụ", "service"),
  ]),
  getItem("Bảng giá", "4", <DollarOutlined />, [getItem("Bảng giá", "price")]),
  getItem("Xe", "5", <CarOutlined />, [
    getItem("Xe khách hàng", "car"),
    getItem("Mẫu xe", "car-model"),
  ]),
  getItem("Người dùng", "6", <UserOutlined />, [
    getItem("Người dùng", "user"),
    getItem("Nhóm người dùng", "user-group"),
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
    router.push("/admin");
    handleOpenKey(key);
  };

  return (
    <div style={{ height:'100%'}}>
      <div className="logo" style={{textAlign:"center"}}>
        <Image
          style={{ alignItems: "center" }}
          width={75}
          height={75}
          src={logo}
          alt="VLCARSERVICE"
        />
      </div>
      <Menu
        mode="inline"
        style={{ height: "100%" }}
        theme="light"
        items={items}
        onClick={onClick}
        defaultSelectedKeys={["car-slot"]}
      />
    </div>
  );
};

export default SideBar;
