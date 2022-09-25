import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
} from "antd";
import { useRouter } from "next/router";
import { openNotification } from "utils/notification";
import { getUserById ,updateUserById} from "api/userAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";

const UserDetail = ({ userId, onUpdateUser }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [userDetail, setUserDetail] = useState({});
  const [modalQuestion, setModalQuestion] = useState(false);



  const fetchUserDetail = async () => {
    try {
      const response = await getUserById(userId);
      setUserDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        phone: response.data.Data.phone,
        email: response.data.Data.email,
        address: response.data.Data.address,
        image: response.data.Data.image,
        status: response.data.Data.status,
      });
    } catch (error) {
      openNotification(error.response.data);
    }
  };

  useEffect(() => {
    if (userId) {
        fetchUserDetail();
    }
  }, [userId]);

  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        email: values.email,
        address: values.address,
        status: values.status,
      };
      const res = await updateUserById(body, userId);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật người dùng thành công!", "");
        onUpdateUser();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <br />
      <br />
      <Row>
        <Col span={6}>
          <Image
            width={300}
            height={250}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </Col>
        <Col span={15}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                },
              ]}
            >
                <Input />
            </Form.Item>

            
            <Form.Item
              label="Trạng thái"
              rules={[
                {
                  required: true,
                },
              ]}
              name="status"
            >
              <Select>
                <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
            <div className="service-action">
              <Button
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      onFinish(values);
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                    });
                }}
              >
                Cập nhật
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserDetail;
