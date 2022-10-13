import React from "react";
import UserPage from "components/User";
import ServicePage from "components/Service";
import CategoryPage from "components/Category";
import CarModelPage from "components/CarModel";
import CarPage from "components/Car";
import PriceHeaderPage from "components/PriceHeader";
import CarSlot from "components/CarSlot";
import OrderPage from "components/Order";
import CustomerPage from "components/Customer";

const MyContent = ({ keyMenu }) => {
  const renderViewByKey = () => {
    switch (keyMenu) {
      case "order":
        return <OrderPage />;
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
      case "customer":
        return <CustomerPage />;
      default:
        break;
    }
  };

  return <>{renderViewByKey()}</>;
};

export default MyContent;
