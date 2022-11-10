import {
  BarChartOutlined,
  UserOutlined,
  TagsOutlined,
  DollarOutlined,
  ShopOutlined,
  CarOutlined,
  BookOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Typography, Affix } from "antd";
import React, { useState, useEffect } from "react";
const { Title } = Typography;
import { useRouter } from "next/router";
import logo from "public/images/logo-sibar.svg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const SideBar = ({ handleOpenKey }) => {
  const router = useRouter();
  const [items, setItems] = useState([]);

  const onClick = ({ item, key, keyPath, domEvent }) => {
    console.log({ item, key, keyPath, domEvent });
    router.push("/admin");
    handleOpenKey(key);
  };

  const roles = Cookies.get("roles");
  const handleRole = (roles) => {
    if (roles === "ROLE_ADMIN") {
      setItems([
        getItem("Đơn hàng", "1", <ShopOutlined />, [
          getItem("Danh sách yêu cầu", "order"),
          getItem("Danh sách đơn hàng", "order-not-request"),
          getItem("Vị trí xử lý", "car-slot"),
        ]),
        getItem("Hóa đơn", "2", <BookOutlined />, [
          getItem("Hóa đơn", "bills"),
          // getItem("Hóa đơn hủy", "bills"),
        ]),
        getItem("Dịch vụ", "3", <ClearOutlined />, [
          getItem("Dịch vụ", "service"),
          getItem("Danh mục", "category"),
        ]),
        getItem("Bảng giá", "4", <DollarOutlined />, [
          getItem("Bảng giá", "price"),
        ]),
        getItem("Xe", "5", <CarOutlined />, [
          getItem("Xe khách hàng", "car"),
          getItem("Mẫu xe", "car-model"),
        ]),
        getItem("Người dùng", "6", <UserOutlined />, [
          getItem("Nhân viên", "user"),
          getItem("Khách hàng", "customer"),
          // getItem("Nhóm người dùng", "user-group"),
        ]),
        getItem("Khuyến mãi", "7", <TagsOutlined />, [
          getItem("Khuyến mãi", "promotion"),
        ]),
        getItem("Thống kê - Báo cáo", "8", <BarChartOutlined />, [
          getItem("Doanh số", "bill-report"),
          // getItem("Dịch vụ", "service-report"),
          // getItem("Khuyến mãi", "promotion-report"),
        ]),
      ]);
    } else {
      setItems([
        getItem("Đơn hàng", "1", <ShopOutlined />, [
          getItem("Danh sách yêu cầu", "order"),
          getItem("Danh sách đơn hàng", "order-not-request"),
          getItem("Vị trí xử lý", "car-slot"),
        ]),
        getItem("Hóa đơn", "2", <BookOutlined />, [
          getItem("Hóa đơn", "bills"),
          // getItem("Hóa đơn hủy", "bills"),
        ]),
        getItem("Dịch vụ", "3", <ClearOutlined />, [
          getItem("Dịch vụ", "service"),
          getItem("Danh mục", "category"),
        ]),
        getItem("Bảng giá", "4", <DollarOutlined />, [
          getItem("Bảng giá", "price"),
        ]),
        getItem("Xe", "5", <CarOutlined />, [
          getItem("Xe khách hàng", "car"),
          getItem("Mẫu xe", "car-model"),
        ]),
        getItem("Người dùng", "6", <UserOutlined />, [
          getItem("Khách hàng", "customer"),
        ]),
        getItem("Khuyến mãi", "7", <TagsOutlined />, [
          getItem("Khuyến mãi", "promotion"),
        ]),
        getItem("Thống kê - Báo cáo", "8", <BarChartOutlined />, [
          getItem("Doanh số", "bill-report"),
          // getItem("Dịch vụ", "service-report"),
          // getItem("Khuyến mãi", "promotion-report"),
        ]),
      ]);
    }
  };

  useEffect(() => {
    handleRole(roles);
  }, [roles]);

  return (
    <div style={{ height: "100%" }}>
      <div className="logo" style={{ textAlign: "center" }}>
        <Link href="/admin">
          <Image
            style={{ alignItems: "center" }}
            width={75}
            height={75}
            src={logo}
            alt="VLCARSERVICE"
          />
        </Link>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        // style={{ height: "100%" }}
        items={items}
        onClick={onClick}
        defaultSelectedKeys={["car-slot"]}
      />
    </div>
  );
};

export default SideBar;
