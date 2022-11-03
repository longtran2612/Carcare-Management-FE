import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Typography,notification } from "antd";
import { LockOutlined,SmileOutlined } from "@ant-design/icons";
import { changePassword } from "pages/api/authAPI";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import { openNotification } from "utils/notification";

function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    const username = Cookies.get("username");
    let changePasswordRequets = {
      username: username,
      newPassword: values.password,
    };
    console.log(changePasswordRequets);
    try {
      const res = await changePassword(changePasswordRequets);
      notification.open({
        message: "thành công",
        description: "Đổi mật khẩu thành công",
        icon:  <SmileOutlined style={{ color: '#4B31DE' }} />,
        placement: "bottomRight",
      
        style: {
         backgroundColor: "#D9EEE1",
          color: "#4B31DE",
          borderRadius: "10px",
        },
    
      });
      setLoading(false);
    
    } catch (error) {
      if (error?.response?.data?.message[0]) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại","Có lỗi xảy ra, vui lòng thử lại sau");
      }
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
