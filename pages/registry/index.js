import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import { onRegister } from "api/authAPI";

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
      <Form className="registry-form p-5" onFinish={onFinish} layout="vertical">
        <h1 className="text-center">Đăng ký</h1>
        <Form.Item
          label="Email"
          name="email"
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
          label=" Xác nhận mật khẩu"
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
        <Form.Item className="text-center">
          <Button
            className="btn-registry"
            type="primary
                        "
            htmlType="submit"
          >
            Đăng ký
          </Button>
          <p className="text-center">
            Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
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
            {/* </a> */}
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
