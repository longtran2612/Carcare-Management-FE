import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Form, Input, Select, InputNumber } from "antd";
import { createCar } from "pages/api/carAPI";
import { getCarModel } from "pages/api/carModel";
import { getCustomers } from "pages/api/customerAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";
const formatDate = "HH:mm DD/MM/YYYY";

const ModalAddCar = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [carModels, setCarModels] = useState([]);
  const [users, setUsers] = useState([]);
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
    "Cadillac",
  ]);

  const onFinish = async (values) => {
    try {
      const res = await createCar(values);
      openNotification("Tạo xe thành công thành công!", "");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCarModels = async () => {
    try {
      const res = await getCarModel();
      setCarModels(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUsersData = async () => {
    try {
      const res = await getCustomers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(users);
  console.log(carModels);

  useEffect(() => {
    getCarModels();
    getUsersData();
  }, []);

  return (
    <>
      <Modal
        title="Thêm mẫu xe"
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
          <Row gutter={[16, 4]}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                label="Người sở hữu"
                rules={[
                  {
                    required: true,
                  },
                ]}
                name="customerId"
              >
                <Select
                  showSearch
                  placeholder="Chọn Người sở hữu"
                  optionFilterProp="children"
                >
                  {users.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Biển số xe"
                name="licensePlate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Model" name="model">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thương hiệu" name="brand">
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
            <Col span={8}>
              <Form.Item label="Màu sắc" name="color">
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Số nghế ngồi" name="seats">
                <InputNumber min={1} max={16} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Năm sản xuất" name="year">
                <InputNumber min={1800} max={moment().year()} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đông cơ" name="engine">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Truyền động" name="transmission">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Nhiên liệu" name="fuel">
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
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCar;
