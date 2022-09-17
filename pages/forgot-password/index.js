import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Typography } from "antd";
import { Form, Input, Button, Col, Row, message } from "antd";
import { Router, useRouter } from "next/router";
import Loading from "components/Loading";
import firebase from "config/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const { Title } = Typography;

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // const onFinish = (values) => {};

  const onFinish = (value) => {
    e.preventDefault();
    console.log(number);
    setError("");
    if (number === "" || number === undefined)
      return setError("Please enter a valid phone number!");
    try {
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
    } catch (err) {
      setError(err.message);
    }
  };
  function setUpRecaptha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
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
              name="number"
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
