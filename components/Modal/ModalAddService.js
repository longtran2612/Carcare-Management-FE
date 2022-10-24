import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
} from "antd";
import { createService } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";

const { TextArea } = Input;
const { Option } = Select;

const ModalAddService = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [currency, setCurrency] = useState("VND");
  const onFinish = async (values) => {
    console.log(values);
    let dataCreate = {
      name: values.name,
      description: values.description,
      type: values.type,
      categoryId: values.categoryId,
      estimateTime: values.estimateTime,
      servicePrice: {
        price: values.price,
        currency: currency,
      },
    };
    console.log(dataCreate);
    try {
      console.log(dataCreate);
      const res = await createService(dataCreate);
      openNotification("Thành công!", "Tạo mới dịch vụ thành công");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      openNotification(error.response.data.message[0]);
    }
  };

  const [listCategory, setListCategory] = useState([]);

  const handleFetchCategory = async () => {
    try {
      const res = await getCategories();
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

  const selectCurrency = (
    <Select
      defaultValue="VND"
      style={{
        width: 60,
      }}
      value={currency}
      onChange={(value) => setCurrency(value)}
    >
      <Option value="VND">Đ</Option>
      <Option value="USD">$</Option>
      <Option value="EUR">€</Option>
      <Option value="GBP">£</Option>
      <Option value="CNY">¥</Option>
    </Select>
  );

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
          <Row gutter={[16, 16]}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                label="Danh mục dịch vụ"
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="categoryId"
              >
                <Select
                  showSearch
                  placeholder="Chọn danh mục"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {listCategory?.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
                  <Select.Option value="LIKE">Yêu thích</Select.Option>
                  <Select.Option value="NEW">Mới</Select.Option>
                  <Select.Option value="NORMAL">Thông thường</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giá dịch vụ"
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="price"
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter={selectCurrency}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Thời gian xử lý"
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="estimateTime"
              >
                <InputNumber addonAfter='phút' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddService;
