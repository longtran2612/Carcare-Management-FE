import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Form, Input, Select, InputNumber } from "antd";
import { createCar } from "pages/api/carAPI";
import { getCarModel } from "pages/api/carModel";
import { getCustomers } from "pages/api/customerAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
const { TextArea } = Input;
import moment from "moment";
import { async } from "@firebase/util";
const formatDate = "HH:mm DD/MM/YYYY";

const ModalAddCarWithCustomer = ({
  customerId,
  show,
  onSuccess,
  handleCancel,
}) => {
  const [form] = Form.useForm();
  const [carModels, setCarModels] = useState([]);

  const onFinish = async (values) => {
    let dataCreate = {
      ...values,
      customerId: customerId,
    };
    try {
      console.log(dataCreate);
    //   const res = await createCar(dataCreate);
    //   openNotification("Thành công", "Thêm mới xe thành công");
    //   handleCancel();
    //   onSuccess(res.data.Data);
    } catch (error) {
      openNotification(error.response.data.message[0]);
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

  console.log(carModels);

  useEffect(() => {
    getCarModels();
  }, [show]);

  return (
    <>
      <Modal
        title="Thêm xe"
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
                label="Tên xe"
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
            <Col span={12}>
              <Form.Item label="Màu sắc" name="color">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Model" name="carModel">
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
                  {carModels.map((carModel) => (
                    <Option key={carModel.id}>{carModel.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddCarWithCustomer;
