import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, Switch } from "antd";
import {
  createService,
  fetchCategoryServiceApi,
  updateServiceApi,
} from "api/serviceAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import Cookies from "js-cookie";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddService = ({ show, onSuccess, handleCancel, item }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      let username = Cookies.get("username");
      let statusTemp = values.status == false ? "INACTIVE" : "ACTIVE";
      let body = {
        id: values.id,
        type: values.type,
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        status: values.status ? statusTemp : item.status,
      };
      const res =
        item == null
          ? await createService({ ...values, createBy: username })
          : await updateServiceApi(body);
      if (res.data.status == 1) {
        openNotification("Tạo dịch vụ thành công!", "");
        handleCancel();
        onSuccess(res.data.Data);
      }
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
  useEffect(() => {
    if (show && item != null) {
      form.setFieldsValue({
        name: item.name,
        type: item.type,
        description: item.description,
        categoryId: item.categoryId,
      });
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
        
          {item != null && (
            <Form.Item label="Trạng thái" name="status">
              <Switch defaultChecked={item.status == "ACTIVE" ? true : false} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddService;
