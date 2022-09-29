import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Col,
  Row,
  InputNumber,
} from "antd";
import { createUser } from "pages/api/userAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddUser = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };
  const onFinish = async (values) => {
    try {
      const res = await createUser(values);
      console.log(res);
      openNotification("Tạo người dùng thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal
        title="Thêm người dùng mới"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row>
            <Col span={22}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Tên người dùng"
                name="fullname"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginRight: "3rem" }}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="phone"
                label="Số điện thoại"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="email"
                label="Email"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={22}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="address"
                label="Địa chỉ"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddUser;
