import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, InputNumber } from "antd";
import { createUser } from "pages/api/userAPI";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddUser = ({ show, handleOk, handleCancel }) => {
  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    createUser(values)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Modal
        title="Thêm Người dùng"
        visible={show}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="Tên người dùng" name="fullname">
            <Input  />
          </Form.Item>
          <Form.Item   name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item  name="address" label="Địa chỉ">
            <Input/>
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button htmlType="submit" type="primary">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddUser;
