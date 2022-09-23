import Link from "next/link";
import { FacebookOutlined, GoogleOutlined , PhoneOutlined ,LockOutlined ,UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Col, Row, message, Typography , Divider } from "antd";
import { useRouter } from "next/router";
import { onRegister } from "api/authAPI";
import { useState } from "react";
const { Title } = Typography;

export default function RegistryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    onRegister(values)
      .then((res) => {
        if (res.data.StatusCode == 200) {
          router.push("/login");
        } else {
          if (res.data.StatusCode === 422) {
            message.error(res.data.message);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error('Đăng ký thất bại! Số điện thoại đã tồn tại');
        message.error('Vui lòng nhập số điện thoại khác');
       
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
                  pattern: new RegExp("^(84|0[3|5|7|8|9])+([0-9]{8})$"),
                  required: true,
                  message:
                    "Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09",
                },
              ]}
            >
              <Input        maxLength={10}
                  minLength={10} prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Nhập vào Số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Họ tên"
              name="fullname"
              rules={[
                {
                  pattern: new RegExp(
                    '^[A-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]+[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*( *[A-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]+[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*)*$'
                ),
                  required: true,
                  message: "Tên không hợp lệ! Tên bắt đầu bằng chữ hoa, không chứa ký tự đặc biệt",
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nhập vào Tên" />
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
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Nhập vào mật khẩu" />
            </Form.Item>
            <Form.Item
              label=" Xác nhận"
              name="confirmPassword"
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
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Xác nhận mật khẩu" />
            </Form.Item>
            <Button
              className="btn-registry"
              type="primary
                        "
              htmlType="submit"
              loading={loading}
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
