import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import { setLogin } from "redux/slices/authSlice";
import { login } from "api/authAPI";
const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const router = useRouter();

  const onFinish = (values) => {
    console.log("values:", values);
    login(values)
      .then((res) => {
        console.log("res:", res);
        if (res.status == 200) {
          console.log(res.data);
          dispatch(setLogin(res.data));
          router.push("/");
        } else {
          if (res.status == 400) {
            message.error(res.message);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        message.error(err.message);
      });
  };

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
        <Col span={8} xs={18} sm={14} md={10} lg={8}>
          <Title level={2} style={{ marginBottom: "20px" }}>
            Đăng nhập
          </Title>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            labelAlign="left"
            size={"middle"}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            className="login-form p-5"
            onFinish={onFinish}
          >
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
            </Form.Item>
          </Form>
          Chưa có tài khoản?<Link href="/registry"> Đăng ký</Link>
          <hr></hr>
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
        </Col>
      </Row>
    </>
  );
}
