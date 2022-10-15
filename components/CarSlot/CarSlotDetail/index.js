import React, { useState, useEffect } from "react";
import {
  Tag,
  Row,
  Col,
  Typography,
  Table,
  Timeline,
  Button,
  Text,
  Card,
  Steps,
} from "antd";
import {
  getCarSlotDetail,
  executeCarSlot,
  completeCarSlot,
} from "pages/api/carSlotApi";
import { SyncOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { formatMoney } from "utils/format";
import { getCarById } from "pages/api/carAPI";
import { getOrderById } from "pages/api/orderAPI";
import { getCustomerById } from "pages/api/customerAPI";
import Loading from "components/Loading";
import Image from "next/image";
import moment from "moment";
import ModalSelectOrder from "components/Modal/ModalSelectOrder";

const formatDate = "HH:mm DD/MM/YYYY";

const CarSlotDetail = ({ carSlotId }) => {
  const { Title } = Typography;
  const { Column, ColumnGroup } = Table;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState(null);
  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);

  const [step, setStep] = useState(1);

  const [carSlotDetail, setCarSlotDetail] = useState();

  const fetchCarSlotDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarSlotDetail(carSlotId);
      setCarSlotDetail(response.data.Data);
      fetchOrderDetail(response.data.Data?.orderId);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCarDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getCarById(data);
      setCar(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getCustomerById(data);
      setCustomer(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (data) => {
    setLoading(true);
    try {
      const response = await getOrderById(data);
      setOrder(response.data.Data);
      fetchCarDetail(response.data.Data.carId);
      fetchCustomerDetail(response.data.Data.customerId);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const totalPriceService = () => {
    return order?.services?.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };

  const totalTimeService = () => {
    return order?.services?.reduce((total, cur) => {
      return (total += cur?.estimateTime);
    }, 0);
  };

  useEffect(() => {
    if (carSlotId) {
      fetchCarSlotDetail();
    }
  }, [carSlotId]);

  const convertStatusCarSlot = (status) => {
    console.log("statusss", status);
    switch (status) {
      case "AVAILABLE":
        return (
          <Tag
            style={{
              width: "150px",
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            color="green"
          >
            Chưa sử dụng
          </Tag>
        );
      case "BOOKED":
        return (
          <Tag
            style={{
              width: "150px",
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            color="red"
          >
            Đã đặt trước
          </Tag>
        );
      case "ACTIVE":
        return (
          <Tag
            style={{
              width: "150px",
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Đang sử dụng
          </Tag>
        );
    }
  };
  console.log(carSlotDetail?.status);

  const handleExecuteOrder = async (data) => {
    let dataExecute = {
      orderId: data,
    };
    try {
      const response = await executeCarSlot(carSlotId, dataExecute);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("customer", customer);
  console.log("order", order);
  console.log("car", car);

  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <div className="carslot">
        <div className="carslot-content">
          <div className="carslot-content--header">
            <Title level={3}>{carSlotDetail?.name}</Title>
            <div> {convertStatusCarSlot(carSlotDetail?.status)}</div>
          </div>
          {carSlotDetail?.status == "ACTIVE" && (
            <Row>
              <Col span={6}>
                <div className="carslot-customer content-white">
                  <Title level={4}>Thông tin khách hàng</Title>
                  <Timeline>
                    <Timeline.Item>Mã: {customer?.customerCode}</Timeline.Item>
                    <Timeline.Item>Tên: {customer?.name}</Timeline.Item>
                    <Timeline.Item>
                      Số điện thoại: {customer?.phoneNumber}
                    </Timeline.Item>
                  </Timeline>
                  <Title level={4}>Thông tin xe</Title>
                  <Timeline>
                    <Timeline.Item>Tên xe: {car?.name}</Timeline.Item>
                    <Timeline.Item>Nhãn hiệu: {car?.brand}</Timeline.Item>
                    <Timeline.Item>Loại xe: {car?.model}</Timeline.Item>
                    <Timeline.Item>Nhiên liệu: {car?.fuel}</Timeline.Item>
                    {/* <Timeline.Item>
                    Hộp số: {carSlotDetail?.car?.carModel?.transmission}
                  </Timeline.Item> */}
                    <Timeline.Item>Chỗ ngồi: {car?.seats}</Timeline.Item>
                    <Timeline.Item>Biển số: {car?.licensePlate}</Timeline.Item>
                    <Timeline.Item>Màu xe: {car?.color}</Timeline.Item>
                    {/* <Timeline.Item>
                    Mô tả: {carSlotDetail?.car?.description}
                  </Timeline.Item> */}
                  </Timeline>
                </div>
              </Col>
              <Col span={18}>
                <Row>
                  <Col
                    className="content-white"
                    style={{ marginBottom: "1rem" }}
                    span={24}
                  >
                    <Steps
                      // type="navigation"
                      // size="small"
                      current={step}
                      // onChange={onChange}
                      className="site-navigation-steps"
                    >
                      <Steps.Step
                        title="Tiếp nhận"
                        status="finish"
                        description={moment(order?.carReceivedDate).format(formatDate) || ""}
                      />
                      <Steps.Step
                        title="Xử lý"
                        status="process"
                        icon={<LoadingOutlined />}
                        description={moment(carSlotDetail?.orderStartExecuting).format(formatDate) || ""}
                      />
                      <Steps.Step
                        title="Hoàn thành"
                        status="wait"
                        description="Thời gian hoàn thành"
                      />
                    </Steps>
                  </Col>
                  <Col span={24}>
                    <Table
                      dataSource={order?.services}
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
                              <Table.Summary.Cell
                                index={2}
                              >
                                {totalTimeService()||0} phút
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3}>
                                {formatMoney(totalPriceService() || 0)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
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
                          render={(text, record) => {
                            return <div>{record.estimateTime} phút</div>;
                          }}
                          title="Thời gian sử lý"
                        ></Column>
                        <Column
                          title="Giá dịch vụ"
                          dataIndex="price"
                          key="price"
                          render={(text, record, dataIndex) => {
                            return (
                              <div>
                                {formatMoney(record?.servicePrice?.price || 0)}
                              </div>
                            );
                          }}
                        />
                      </ColumnGroup>
                    </Table>
                  </Col>
                </Row>
                <Row>
                  <Button
                    style={{ position: "absolute", right: "20px", bottom: "0" }}
                    type="primary"
                    size="large"
                  >
                    Hoàn thành - Xuất hóa đơn
                  </Button>
                </Row>
              </Col>
            </Row>
          )}
          {carSlotDetail?.status == "AVAILABLE" && (
            <Row className="content-white" span={24}>
              <Col span={24}>
                <Typography.Title className="content-center" level={2}>
                  Vị trí đang trống !!! vui lòng chọn yêu cầu sử lý
                </Typography.Title>
              </Col>
              <Col span={24}>
                <ModalSelectOrder
                  onSelectOrder={(value) => handleExecuteOrder(value)}
                />
              </Col>
            </Row>
          )}
        </div>
      </div>

      <Loading loading={loading} />
    </>
  );
};

export default CarSlotDetail;
