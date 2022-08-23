import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row } from "antd";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  return (
    <>
      <div className="login">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={14} lg={14} xl={14}></Col>
          <Col xs={24} sm={24} md={10} lg={10} xl={8} className="text-left">
            <Form className="login-form p-5" layout="vertical">
              <h1 className="text-center">Đăng nhập</h1>
              <Form.Item
                label="Email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Email không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập vào Email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input.Password placeholder="Nhập vào mật khẩu" />
              </Form.Item>
              <Form.Item className="text-center">
                <Button
                  className="btn-login"
                  type="primary
                            "
                  htmlType="submit"
                >
                  Đăng nhập
                </Button>

                <p>
                  Chưa có tài khoản?<Link href="/registry"> Đăng ký</Link>
                </p>
                <hr></hr>
              </Form.Item>
              <Form.Item>
                <p className="text-center"> Hoặc đăng nhập bằng</p>
                <div className="logo_sign-up">
                  {/* <a href={authLink.googleAuth}> */}
                    <div className="block-google block">
                      <div className="icon-login">
                        <GoogleOutlined style={{ fontSize: "30px" }} />
                      </div>
                      <div className="text-button">
                        <span>Đăng nhập với Google</span>
                      </div>
                    </div>
                  {/* </a>
                  <a href={authLink.facebookAuth}> */}
                    <div className="block-facebook block">
                      <div className="icon-login">
                        <FacebookOutlined style={{ fontSize: "30px" }} />
                      </div>
                      <div className="text-button">
                        <span>Đăng nhập với Facebook</span>
                      </div>
                    </div>
                  {/* </a> */}
                </div>
              </Form.Item>
            </Form>
          </Col>
          <Col xs={24} sm={24} md={0} lg={0} xl={2}></Col>
        </Row>
      </div>
    </>
  );
}
