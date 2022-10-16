import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  Typography,
  Steps,
  Button,
  DatePicker,
  Divider,
  Timeline,
  Table,
} from "antd";
import { getCustomers } from "pages/api/customerAPI";
import { getCustomerById } from "pages/api/customerAPI";
import { getCarById } from "pages/api/carAPI";
import { createOrder } from "pages/api/orderAPI";
import { getCarbyCustomerId } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import ServiceOrder from "./ModalService";
import { formatMoney } from "utils/format";
import ModalAddCustomer from "./ModalAddCustomer";
import ModalAddCar from "./ModalAddCar";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

const ModalAddOrder = ({ show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);

  const [customerOrder, setCustomerOrder] = useState(null);
  const [carOrder, setCarOrder] = useState(null);

  const [services, setServices] = useState([]);
  const [serviceIds, setServiceIds] = useState([]);

  const [modalCar, setModalCar] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(false);

  const [current, setCurrent] = useState(0);

  const handleFetchCustomer = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchCar = async () => {
    try {
      const res = await getCarbyCustomerId(form.getFieldValue("customerId"));
      setCars(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchCustomer();
    }
      handleFetchCar();  
    if (current == 2) {
      handleGetData();
    }
  }, [show, current, form]);

  const handelChangeUser = async () => {
    handleFetchCar();
  };

  const handleGetData = async () => {
    const resCustomer = await getCustomerById(form.getFieldValue("customerId"));
    setCustomerOrder(resCustomer.data.Data);
    console.log(resCustomer.data.Data);
    const resCar = await getCarById(form.getFieldValue("carId"));
    setCarOrder(resCar.data.Data);
    console.log(resCar.data.Data);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSuccessCreateCar = async (data) => {
    await handleFetchCar();
    form.setFieldsValue({
      carId: data.id,
    });
  };
  const handleSuccessCreateCustomer = async (data) => {
    await handleFetchCustomer();
    form.setFieldsValue({
      customerId: data.id,
    });
  };

  const totalPriceService = () => {
    return services.reduce((total, cur) => {
      return (total += cur.servicePrice.price);
    }, 0);
  };
  const totalTimeService = () => {
    return services.reduce((total, cur) => {
      return (total += cur.estimateTime);
    }, 0);
  };

  const onFinish = async () => {

    const dataCreateOrder = {
      carId: form.getFieldValue("carId"),
      customerId: form.getFieldValue("customerId"),
      serviceIds: services.map((item) => item.id),
      receiveDate: form.getFieldValue("receiveDate"),
      executeDate:  form.getFieldValue("executeDate"),
      deliverDate:  form.getFieldValue("deliverDate"),
    };
    try {
      const res = await createOrder(dataCreateOrder);
      openNotification("Thành công!", "Tạo yêu cầu thành công");
      handleCancel();
      handleReset();
      onSuccess(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setCarOrder(null);
    setCustomerOrder(null);
    setServices([]);
    setServiceIds([]);
    setCurrent(0);
  };


  console.log(
    form.getFieldsValue(["receiveDate", "executeDate", "deliverDate"])
  );
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
                  onClick={() =>
                    form.validateFields().then((values) => {
                      onFinish(values);
                    })
                  }
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
                <ServiceOrder
                  selectedService={(value) => setServices(value)}
                  onSelected={(value) => setServiceIds(value)}
                />
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
                <Col style={{ display: "flex", alignItems: "center" }} span={4}>
                  <Button type="primary" onClick={() => setModalCustomer(true)}>
                    Thêm mới khách hàng
                  </Button>
                </Col>
                <Col span={8}>
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
                    
                    >
                      {cars.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }} span={4}>
                  <Button type="primary" onClick={() => setModalCar(true)}>
                    Thêm mới xe
                  </Button>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Nhập ngày nhận xe dự kiến"
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
                    label="Nhập ngày xử lý dự kiến"
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
                    label="Nhập ngày giao xe dự kiến"
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
                <Col span={24}>
                  <Title level={4}>Thông tin yêu cầu</Title>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Table
                        pagination={false}
                        summary={() => {
                          return (
                            <>
                              <Table.Summary.Row>
                                <Table.Summary.Cell
                                  index={0}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell
                                  index={1}
                                ></Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                  {totalTimeService() || 0} phút
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                  {formatMoney(totalPriceService() || 0)}
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            </>
                          );
                        }}
                        dataSource={services}
                        bordered
                      >
                        <ColumnGroup title="Dịch vụ sử dụng">
                          <Column
                            title="STT"
                            dataIndex="stt"
                            key="stt"
                            width={70}
                            render={(text, record, dataIndex) => {
                              return <div>{dataIndex + 1}</div>;
                            }}
                          />
                          <Column
                            title="Tên dịch vụ"
                            dataIndex="name"
                            key="name"
                          />
                          <Column
                            dataIndex="estimateTime"
                            key="estimateTime"
                            title="Thời gian sử lý"
                          ></Column>
                          <Column
                            title="Giá dịch vụ"
                            dataIndex="price"
                            key="price"
                            render={(text, record, dataIndex) => {
                              return (
                                <div>
                                  {formatMoney(record.servicePrice.price)}
                                </div>
                              );
                            }}
                          />
                        </ColumnGroup>
                      </Table>
                    </Col>
                    <Col span={24}>
                      <div
                        style={{
                          backgroundColor: "#fff",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        <Row gutter={32}>
                          <Col
                            style={{ borderRight: "solid LightGray 1px" }}
                            span={8}
                          >
                            <Title style={{ textAlign: "center" }} level={4}>
                              Khách hàng
                            </Title>
                            <Divider />
                            <Timeline style={{ marginTop: "20px" }}>
                              <Timeline.Item>
                                Mã: {customerOrder?.customerCode}
                              </Timeline.Item>
                              <Timeline.Item>
                                Tên: {customerOrder?.name}
                              </Timeline.Item>
                              <Timeline.Item>
                                Số điện thoại: {customerOrder?.phoneNumber}
                              </Timeline.Item>
                            </Timeline>
                          </Col>
                          <Col
                            style={{ borderRight: "solid LightGray 1px" }}
                            span={8}
                          >
                            <Title style={{ textAlign: "center" }} level={4}>
                              Xe
                            </Title>
                            <Divider />
                            <Timeline style={{ marginTop: "20px" }}>
                              <Timeline.Item>
                                Mã: {carOrder?.carCode}
                              </Timeline.Item>
                              <Timeline.Item>
                                Xe: {carOrder?.name}
                              </Timeline.Item>
                              <Timeline.Item>
                                Biển số: {carOrder?.licensePlate}
                              </Timeline.Item>
                            </Timeline>
                          </Col>
                          <Col span={8}>
                            <Title style={{ textAlign: "center" }} level={4}>
                              Thông tin
                            </Title>

                            <Divider />
                            <Timeline style={{ marginTop: "20px" }}>
                              <Timeline.Item>
                                Thời gian nhận xe dự kiến:{" "}
                                {moment(
                                  form.getFieldsValue([
                                    "receiveDate"
                                  ]).receiveDate
                                ).format(formatDate)}{" "}
                              </Timeline.Item>
                              <Timeline.Item>
                                Thời gian sử lý dự kiến:{" "}
                                {moment(
                                  form.getFieldsValue([
                                    "executeDate"
                                  ]).executeDate
                                ).format(formatDate)}{" "}
                              </Timeline.Item>
                              <Timeline.Item>
                                Thời gian hoàn thành dự kiến:
                                {moment(
                                  form.getFieldsValue([
                                    "deliverDate"
                                  ]).deliverDate
                                ).format(formatDate)}{" "}
                              </Timeline.Item>
                            </Timeline>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Modal>
      <ModalAddCar
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(value) => handleSuccessCreateCar(value)}
      />
      <ModalAddCustomer
        show={modalCustomer}
        handleCancel={() => setModalCustomer(false)}
        onSuccess={(value) => handleSuccessCreateCustomer(value)}
      />
    </>
  );
};

export default ModalAddOrder;