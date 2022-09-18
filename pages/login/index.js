import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography ,Divider } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import { setLogin } from "redux/slices/authSlice";
import { login } from "api/authAPI";
import Loading from "components/Loading";
const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onFinish = (values) => {
    setLoading(true);
    console.log("values:", values);
    login(values)
      .then((res) => {
        console.log("res:", res);
        if (res.data.status == 1) {
          console.log(res.data);
          dispatch(setLogin(res.data.data));
          router.push("/");
        } else {
          if (res.status == 400) {
            message.error(res.message);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        message.error(err.message);
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
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input placeholder="Nhập vào số điện thoại" />
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
            <Button
              className="btn-login"
              type="primary
                            "
              htmlType="submit"
            >
              Đăng nhập
            </Button>
          </Form>
          <Divider />
          Chưa có tài khoản?<Link href="/registry"> Đăng ký</Link>
          <br/>
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
