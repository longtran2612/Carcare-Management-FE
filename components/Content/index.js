import { HomeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button, Spin } from "antd";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { logout } from "api/authAPI";
import UserPage from "components/User";
import ServicePage from "components/Service";
import CategoryPage from "components/Category";
import CarModelPage from "components/CarModel";
import CarPage from "components/Car";
const { Content } = Layout;

const MyContent = ({ keyMenu }) => {
  const [breadcrumb, setBreadcrumb] = useState(false);
  const [breadcrumb_extras, setBreadcrumbExtras] = useState(null);
  const router = useRouter();

  const breadcrumbComponent = () => {
    if (!breadcrumb) return null;

    let items = [];
    breadcrumb.forEach((bc) => {
      items.push(
        <Breadcrumb.Item
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            if (bc.href) router.push(bc.href);
          }}
        >
          {bc.title}
        </Breadcrumb.Item>
      );
    });

    return (
      <Affix
        target={() => container}
        style={{
          margin: "5px 16px 0px",
          padding: "20px 0px 0px",
        }}
      >
        <Row wrap={false} className="action">
          <Col flex="auto">
            <Breadcrumb>
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              {items}
            </Breadcrumb>
          </Col>
          <Col flex="null">
            <Space
              direction="horizontal"
              style={{ width: "100%", justifyContent: "end" }}
            >
              {breadcrumb_extras}
            </Space>
          </Col>
        </Row>
      </Affix>
    );
  };
  const renderViewByKey = () => {
    switch (keyMenu) {
      case "shop":
        return <UserPage />;
      case "service":
        return <ServicePage />;
      case "category":
        return <CategoryPage />;
      case "user":
        return <UserPage />;
      case "user-group":
        return <UserPage />;
      case "car":
        return <CarPage/>;
      case "car-model":
        return <CarModelPage/>;
      default:
        break;
    }
  };

  return (
    // <div ref={setContainer}>
    //   {breadcrumbComponent()}
    //   <Content
    //     className="site-layout-background"
    //     style={{
    //       margin: "5px 5px",
    //       padding: 24,
    //       minHeight: 280,
    //     }}
    //   >
    //   <UserPage/>
    //   </Content>
    // </div>
    <>
      <Content
        className="site-layout-background"
        style={{
          margin: "5px 5px",
          padding: 10,
          minHeight: 280,
        }}
      >
        {renderViewByKey()}
      </Content>
    </>
  );
};

export default MyContent;
