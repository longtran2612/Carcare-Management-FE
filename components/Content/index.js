import { HomeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button, Spin } from "antd";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { logout } from "pages/api/authAPI";
import UserPage from "components/User";
import ServicePage from "components/Service";
import CategoryPage from "components/Category";
import CarModelPage from "components/CarModel";
import CarPage from "components/Car";
import PriceHeaderPage from "components/PriceHeader";
import CarSlot from "components/CarSlot";
const { Content } = Layout;

const MyContent = ({ keyMenu }) => {
  const renderViewByKey = () => {
    switch (keyMenu) {
      case "service":
        return <ServicePage />;
      case "category":
        return <CategoryPage />;
      case "user":
        return <UserPage />;
      case "user-group":
        return <UserPage />;
      case "car":
        return <CarPage />;
      case "car-model":
        return <CarModelPage />;
      case "price":
        return <PriceHeaderPage />;
      case "car-slot":
        return <CarSlot />;
      default:
        break;
    }
  };

  return <>{renderViewByKey()}</>;
};

export default MyContent;
