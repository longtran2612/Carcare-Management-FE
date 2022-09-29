import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Switch, InputNumber, DatePicker } from "antd";
import { createPriceHeader } from "pages/api/PriceHeaderAPI";
import { getServices } from "pages/api/serviceAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";
const formatDate = "YYYY/MM/DD";


const ModalAddPriceHeader = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await createPriceHeader(values);
      openNotification("Tạo bảng giá thành công thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title="Thêm bảng giá mới"
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
          <Form.Item
            label="Tên bảng giá"
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
                label="Mô tả"
                name="description"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                label="Ngày bắt đầu"
                name="fromDate"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <DatePicker format={formatDate} />
            </Form.Item>
            <Form.Item
                label="Ngày kết thúc"
                name="toDate"
                rules={[
                {
                    required: true,
                },
                ]}
            >
                <DatePicker format={formatDate} />
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddPriceHeader;
