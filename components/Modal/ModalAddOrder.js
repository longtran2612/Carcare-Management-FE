import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  Steps,
  Button,
  DatePicker,
} from "antd";
import { getCustomers } from "pages/api/customerAPI";
import { createOrder } from "pages/api/orderAPI";
import { getCarbyCustomerId } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import ServiceOrder from "./ModalService";
import ModalAddCustomer from "./ModalAddCustomer";
import ModalAddCar from "./ModalAddCar";

const { Option } = Select;
const formatDate = "YYYY/MM/DD";

const ModalAddOrder = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(null);
  const [carSelected, setCarSelected] = useState(null);

  const [modalCar, setModalCar] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(false);

  const [current, setCurrent] = useState(0);

  const handleFetchUser = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchCar = async () => {
    try {
      const res = await getCarbyCustomerId(customerSelected);
      setCars(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchUser();
    }
  }, [show]);

  const handelChangeUser = async (value) => {
    setCustomerSelected(value);
    handleFetchCar();
  };

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSuccessCreateCar = () => {
    handleFetchCar();
  };
  const handleSuccessCreateCustomer = () => {
    handleFetchUser();
  };

  return (
    <>
      <Modal
        title="Tạo mới yêu cầu"
        visible={show}
        width="90%"
        closable
        onCancel={handleCancel}
        cancelText="Hủy bỏ"
        footer={
          <>
            <div className="steps-action">
              {current > 0 && (
                <Button
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => prev()}
                >
                  Quay lại
                </Button>
              )}
              {current < 2 && (
                <Button type="primary" onClick={() => next()}>
                  Tiếp tục
                </Button>
              )}
              {current === 2 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Hoàn thành
                </Button>
              )}
            </div>
          </>
        }
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16]}>
            <Col span={24}>
              <div style={{ margin: "10px" }}>
                <Steps current={current}>
                  <Steps.Step title="Chọn dịch vụ" />
                  <Steps.Step title="Chọn khách hàng - xe - thời gian" />
                  <Steps.Step title="Hoàn thành" />
                </Steps>
              </div>
            </Col>
            {current === 0 && (
              <Col span={24}>
                <ServiceOrder />
              </Col>
            )}
            {current === 1 && (
              <>
                <Col span={8}>
                  <Form.Item
                    label="Khách hàng"
                    name="customerId"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn khách hàng"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                      onChange={handelChangeUser}
                    >
                      {customers.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col  style={{display:'flex',alignItems:'center'}} span={4}>
                
                    <Button
                      type="primary"
                      onClick={() => setModalCustomer(true)}
                    >
                      Thêm mới khách hàng
                    </Button>
                
                </Col>
                <Col   span={8}>
                  <Form.Item
                    label="Xe"
                    name="carId"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Chọn xe"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                      onChange={(value) => setCarSelected(value)}
                    >
                      {cars.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{display:'flex',alignItems:'center'}} span={4}>
                  <Button type="primary" onClick={() => setModalCar(true)}>
                    Thêm mới xe
                  </Button>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ngày nhận xe"
                    name="receiveDate"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Nhập ngày nhận xe dự kiến"
                      format={formatDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ngày xử lý"
                    name="executeDate"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Nhập ngày xử lý dự kiến"
                      format={formatDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ngày giao xe"
                    name="deliverDate"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Nhập ngày giao xe dự kiến"
                      format={formatDate}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            {current === 2 && (
              <>
                <Col span={24}></Col>
              </>
            )}
          </Row>
        </Form>
      </Modal>
      <ModalAddCar
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={() => handleSuccessCreateCar()}
      />
      <ModalAddCustomer
        show={modalCustomer}
        handleCancel={() => setModalCustomer(false)}
        onSuccess={() => handleSuccessCreateCustomer()}
      />
    </>
  );
};

export default ModalAddOrder;
