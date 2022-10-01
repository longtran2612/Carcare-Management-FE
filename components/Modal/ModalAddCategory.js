import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  DatePicker,
} from "antd";
import { createCategory } from "pages/api/categoryAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;

const ModalAddCategory = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await createCategory(values);
      openNotification("Tạo danh mục dịch vụ thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title="Thêm danh mục dịch vụ mới"
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
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row>
            <Col span={16} className='MarRight20'>
              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Loại doanh mục"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select style={{width:'100%'}}>
                  <Option value="NORMAL">Thường</Option>
                  <Option value="NEW">Mới</Option>
                  <Option value="HOT">HOT</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCategory;
