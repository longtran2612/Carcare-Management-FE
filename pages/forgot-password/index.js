import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography } from "antd";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import Loading from "components/Loading";
const { Title } = Typography;

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish = (values) => {};

  return (
    <>
      <Row
        justify="space-around"
        align="middle"
        style={{
          height: "100vh",

          textAlign: "center",
        }}
      >
        <Col
          span={18}
          xs={18}
          sm={14}
          md={10}
          lg={8}
          style={{
            backgroundColor: "#DFE9F8",
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <Title level={2} style={{ marginBottom: "20px" }}>
            Lấy lại mật khẩu
          </Title>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            labelAlign="left"
            size={"middle"}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Số điện thoại"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input placeholder="Nhập vào số điện thoại" />
            </Form.Item>

            <Button
              className="btn-login"
              type="primary
                            "
              htmlType="submit"
            >
              Gửi mã OTP
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
