import { HomeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { lazy, Suspense } from "react";
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button, Spin } from "antd";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { logout } from "api/authAPI";
import ListForm from "components/ListForm";
import Link from "next/link";
import UserPage from "components/User";

const { Content } = Layout;

const MyContent = (props) => {
  const [container, setContainer] = useState(null);
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

  return (
    <div ref={setContainer}>
      {breadcrumbComponent()}
      <Content
        className="site-layout-background"
        style={{
          margin: "5px 5px",
          padding: 24,
          minHeight: 280,
        }}
      >
      <UserPage/>
      </Content>
    </div>
  );
};

export default MyContent;
