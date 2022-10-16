import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { changePassword } from "pages/api/userAPI";
import Loading from "components/Loading";

function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    const changePasswordRequets = {
      username: phoneNumber,
      newPassword: values.password,
    };
    console.log(changePasswordRequets);
    try {
      changePassword(changePasswordRequets).then((res) => {
        console.log(res);
        if (res.data.StatusCode == 200) {
          message.success("Thay đổi mật khẩu thành công!");
          success();
          // router.push("/login");
        } else {
          message.error(res.data.message);
        }
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      message.error(err.message);
    }
  };
  return (
    <>
      <Row
        justify="space-around"
        align="middle"
        style={{
          textAlign: "center",
        }}
      >
        <Col
          span={20}
          xs={20}
          sm={20}
          md={20}
          lg={12}
          className="background-login-white"
          style={{
            padding: "50px",
            borderRadius: "10px",
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            labelAlign="left"
            size={"middle"}
            wrapperCol={{ span: 18 }}
            onFinish={handleChangePassword}
          >
            <Typography.Title
              level={2}
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#1890ff",
              }}
            >
              Thay đổi mật khẩu
            </Typography.Title>
            <Form.Item
              label="Mật khẩu cũ"
              name="oldPassword"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Nhập vào mật cũ"
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
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
                placeholder="Nhập vào mật khẩu mới"
              />
            </Form.Item>
            <Form.Item
              label=" Xác nhận"
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message:
                    "Mật khẩu không hợp lệ! Mật khẩu bao gồm 6-32 ký tự bao gồm chữ, số và ký tự đặc biệt",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Xác nhận mật khẩu phải trùng nhau!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>
            <Button
              className="btn-login center"
              type="primary
                            "
              htmlType="submit"
              loading={loading}
            >
              Thay đổi
            </Button>
          </Form>
        </Col>
      </Row>
      <Loading loading={loading} />
    </>
  );
}

export default ChangePassword;
