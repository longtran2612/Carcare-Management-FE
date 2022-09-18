import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message, Typography , Divider } from "antd";
import { Router, useRouter } from "next/router";
import { onRegister } from "api/authAPI";
const { Title } = Typography;

export default function RegistryPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const onFinish = (values) => {
    onRegister(values)
      .then((res) => {
        console.log("res:", res);
        if (res.status === 200) {
          console.log(res.data);
          router.push("/login");
        } else {
          if (res.status === 400) {
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
            Đăng ký
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
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Số điện thoại không được để trống!",
                },
              ]}
            >
              <Input placeholder="Nhập vào Số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Họ tên"
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Tên không được để trống!",
                },
              ]}
            >
              <Input placeholder="Nhập vào Tên" />
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
            <Form.Item
              label=" Xác nhận"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu không được để trống!",
                },
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu" />
            </Form.Item>
            <Button
              className="btn-registry"
              type="primary
                        "
              htmlType="submit"
            >
              Đăng ký
            </Button>
          </Form>
          <p className="text-center">
            Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
          </p>
          <Divider/>
          Quên mật khẩu?<Link href="/forgot-password"> Lấy lại mật khẩu</Link>
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
            {/* </a> */}
            {/* <a href={authLink.facebookAuth}> */}
            <div className="block-facebook block">
              <div className="icon-login">
                <FacebookOutlined style={{ fontSize: "30px" }} />
              </div>
              <div className="text-button">
                <span>Đăng nhập với Facebook</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
