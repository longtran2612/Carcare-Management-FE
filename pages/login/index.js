import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography, Divider } from "antd";
import {
  FacebookOutlined,
  GoogleOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import { setLogin } from "redux/slices/authSlice";
import { login } from "api/authAPI";
const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish = (values) => {
    setLoading(true);
    login(values)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          dispatch(setLogin(res.data.Data));
          router.push("/");
        } else {
          if (res.status == 422) {
            message.error(res.data.message);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.response.data.message);
      });
  };

  return (
    <>
      {/* <div class="container"> */}
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
          sm={18}
          md={18}
          lg={10}
          style={{
            backgroundColor: "#DFE9F8",
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <Title level={2} style={{ marginBottom: "20px" }}>
            Đăng nhập
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
                  pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                  required: true,
                  message:
                    "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                },
              ]}
            >
              <Input
                maxLength={10}
                minLength={10}
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào số điện thoại"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  pattern: new RegExp(
                    "^([0-9a-zA-Z]*[.!@$%^&(){}[]:;<>,.?/~_+-=|]*).{6,32}$"
                  ),
                  required: true,
                  message:
                    "Mật khẩu không hợp lệ! Mật khẩu bao gồm 6-32 ký tự bao gồm chữ, số và ký tự đặc biệt",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào mật khẩu"
              />
            </Form.Item>
            <Button
              className="btn-login"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form>
          <Divider />
          Chưa có tài khoản?<Link href="/registry"> Đăng ký</Link>
          <br />
          Quên mật khẩu?<Link href="/forgot-password"> Lấy lại mật khẩu</Link>
          {/* <p className="text-center"> Hoặc đăng nhập bằng</p>
          <div className="logo_sign-up">
            <div className="block-google block">
              <div className="icon-login">
                <GoogleOutlined style={{ fontSize: "30px" }} />
              </div>
              <div className="text-button">
                <span>Đăng nhập với Google</span>
              </div>
            </div>
       
            <div className="block-facebook block">
              <div className="icon-login">
                <FacebookOutlined style={{ fontSize: "30px" }} />
              </div>
              <div className="text-button">
                <span>Đăng nhập với Facebook</span>
              </div>
            </div>
          </div> */}
        </Col>
      </Row>
    </>
  );
}
