import React, { useState } from "react";
import { Modal, Button, Form, Input, Select, InputNumber } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddService = ({ show, handleOk, handleCancel }) => {
  const buttonItemLayout = {
    wrapperCol: {
      span: 14,
      offset: 4,
    },
  };
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  return (
    <>
      <Modal
        title="Thêm dịch vụ"
        visible={show}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item label="Tên dịch vụ" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả">
            <TextArea />
          </Form.Item>
          <Form.Item label="Danh mục dịch vụ">
            <Select>
              <Option value="jack">Sơn</Option>
              <Option value="vesinh">Vệ sinh</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Giá">
            <InputNumber />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            {/* <Button type="primary">Submit</Button> */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddService;
