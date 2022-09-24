import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Switch } from "antd";
import { createService, fetchCategoryServiceApi } from "api/serviceAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddService = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await createService(values);
      openNotification("Tạo dịch vụ thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [listCategory, setListCategory] = useState([]);

  const handleFetchCategory = async () => {
    try {
      const res = await fetchCategoryServiceApi();
      setListCategory(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchCategory();
    }
  }, [show]);

  return (
    <>
      <Modal
        title="Thêm dịch vụ"
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
            label="Tên dịch vụ"
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
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Danh mục dịch vụ"
            rules={[
              {
                required: true,
              },
            ]}
            name="categoryId"
          >
            <Select>
              {listCategory?.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kiểu dịch vụ"
            rules={[
              {
                required: true,
              },
            ]}
            name="type"
          >
            <Select>
              <Select.Option value="HOT">HOT</Select.Option>
              <Select.Option value="LIKE">LIKE</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddService;
