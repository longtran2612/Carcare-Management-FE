import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
 
  InputNumber,
} from "antd";
import { createCarModel } from "pages/api/carModel";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";
const formatDate = "YYYY/MM/DD";

const ModalAddCarModel = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([
    "Toyota",
    "VinFast",
    "Nissan",
    "Suzuki",
    "Subaru",
    "Lexus",
    "Audi",
    "Volkswagen",
    "Honda",
    "Volvo",
    "Hyundai",
    "Mazda",
    "KIA",
    "Mitsubishi",
    "Maserati",
    "Chevrolet",
    "Ford",
    "Mercedes-Benz",
    "BMW",
  ]);
  const onFinish = async (values) => {
    try {
      const res = await createCarModel(values);
      openNotification("Tạo mẫu xe thành công thành công!", "");
      handleCancel();
      onSuccess(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title="Thêm mẫu xe mới"
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
            <Col span={11} className="MarRight40">
              <Form.Item
                label="Tên mẫu xe"
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
            <Col span={5} className="MarRight20">
              <Form.Item
                label="Số nghế ngồi"
                name="seats"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={1} max={16} />
              </Form.Item>
            </Col>
            <Col span={5} className="MarRight20">
              <Form.Item
                label="Năm sản xuất"
                name="year"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <InputNumber min={1900} max={moment().year()} />
              </Form.Item>
            </Col>
            <Col span={11}  className="MarRight40">
              <Form.Item
                label="Model"
                name="model"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Thương hiệu"
                name="brand"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn thương hiệu"
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
                  {brands.map((brand) => (
                    <Option key={brand}>{brand}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
        
            <Col span={7}  className="MarRight20">
              <Form.Item
                label="Đông cơ"
                name="engine"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={7} className="MarRight20"  >
              <Form.Item
                label="Truyền động"
                name="transmission"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={7} className="MarRight20">
              <Form.Item
                label="Nhiên liệu"
                name="fuel"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select 
                  showSearch
                  placeholder="Chọn nhiên liệu"
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
                  <Option value="Xăng">Xăng</Option>
                  <Option value="Dầu">Dầu</Option>
                  <Option value="Điện">Điện</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCarModel;
