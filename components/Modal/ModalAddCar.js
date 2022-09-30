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
import { createCar } from "pages/api/carAPI";
import { getCarModel } from "pages/api/carModel";
import { getUsers } from "pages/api/userAPI";

import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";
const formatDate = "YYYY/MM/DD";

const ModalAddCar = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [carModels, setCarModels] = useState([]);
  const [users, setUsers] = useState([]);

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
      const res = await getUsers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
console.log(users)

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
                label="Màu sắc"
                name="color"
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
            <Col span={11} className="MarRight40">
              <Form.Item label="Mẫu xe" name="carModelId">
                <Select
                  showSearch
                  placeholder="Chọn mẫu xe"
                  optionFilterProp="children"
                  filterOption={(i, o) =>
                    o.children.includes(i)
                  }
                  
                >
                  {carModels.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={11} >
              <Form.Item label="Người sở hữu" name="userId">
                <Select
                  showSearch
                  placeholder="Chọn Người sở hữu"
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
         
            <Col span={23}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCar;
