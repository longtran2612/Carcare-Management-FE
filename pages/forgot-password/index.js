import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Typography } from "antd";
import { Form, Input, Button, Col, Row, message ,Modal } from "antd";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import { auth } from "config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { changePassword, checkExistPhone } from "api/authAPI";

const { Title } = Typography;

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  const getOtp = async (values) => {
    const number = "+84" + values.phone;
    console.log("number:", number);
    setPhoneNumber(number);
    const check = await checkExistPhone(number).then((res) => {

      return res.data;
    });
    console.log("check:", check);
    if (number === "" || number === undefined || check ===true ){
      message.error("Số điện thoại không tồn tại");
      return
    }
    try {
      const response = await setUpRecaptha(number);
      setResult(response);
      setFlag(true);
      setStep(2);
    } catch (err) {
      message.error(err.message);
    }
  };
  function setUpRecaptha(number) {
    // const recaptchaVerifier = new RecaptchaVerifier(
    //   "recaptcha-container",
    //   {},
    //   auth
    // );
    const recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      },
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  const verifyOtp = async (e) => {
    if (otp === "" || otp === null) return;
    try {
      await result.confirm(otp);
      setStep(3);
      message.success("Verify success!");
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleChangePassword = async (values) => {
    const changePasswordRequets = {
      username: phoneNumber,
      newPassword: values.password,
    };
    console.log(changePasswordRequets);
    try {
      changePassword(changePasswordRequets).then(
        (res) => {
          if (res.data.status == 1) {
            message.success("Change password success!");
            success();
            // router.push("/login");
          } else {
            message.error(res.data.message);
          }
        }
      );
    } catch (err) {
      message.error(err.message);
    }
  };

  function success() {
    Modal.success({
        content: 'Cập nhật tài khoản thành công !',
        onOk: () => {
            router.push('/login');
        },
        onCancel: () => {
            router.push('/login');
        },
    });
}

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
          {step == 1 && (
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              labelAlign="left"
              size={"middle"}
              wrapperCol={{ span: 18 }}
              onFinish={getOtp}
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
                <Input placeholder="Nhập vào số điện thoại" />
              </Form.Item>
              <div id="recaptcha-container"></div>

              <Button
                id="sign-in-button"
                className="btn-login"
                type="primary
                            "
                htmlType="submit"
              >
                Gửi mã OTP
              </Button>
            </Form>
          )}
          {step === 2 && (
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              labelAlign="left"
              size={"middle"}
              wrapperCol={{ span: 18 }}
              onFinish={verifyOtp}
            >
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[
                  {
                    required: true,
                    message: "Mã OTP không được để trống!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Nhập vào mã OTP"
                />
              </Form.Item>

              <Button
                className="btn-login"
                type="primary
                            "
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </Form>
          )}
          {step === 3 && (
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              labelAlign="left"
              size={"middle"}
              wrapperCol={{ span: 18 }}
              onFinish={handleChangePassword}
            >
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập vào mật khẩu mới" />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Nhập vào mật khẩu mới" />
              </Form.Item>

              <Button
                className="btn-login"
                type="primary
                            "
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
}
