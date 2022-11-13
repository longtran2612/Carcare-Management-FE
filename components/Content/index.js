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
import OrderNotRequestPage from "components/OrderNotRequest";
import PromotionHeaderPage from "components/Promotion";
import BillPage from "components/Bill";
import ReportPage from "components/Report";
import StatisticalPage from "components/Statistics";
const MyContent = ({ keyMenu }) => {
  const renderViewByKey = () => {
    switch (keyMenu) {
      case "order":
        return <OrderPage />;
      case "order-not-request":
        return <OrderNotRequestPage />;
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
      case "promotion":
        return <PromotionHeaderPage />;
      case "bills":
        return <BillPage />;
      case "report":
        return <ReportPage/>
      case "statistic":
        return <StatisticalPage />;
      default:
        break;
    }
  };

  return <>{renderViewByKey()}</>;
};

export default MyContent;
