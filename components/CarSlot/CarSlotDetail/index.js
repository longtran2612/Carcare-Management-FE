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
  getCarSlotByCode,
  getCarSlotDetail,
  executeCarSlot,
  cancelCarSlot,
  completeCarSlot,
} from "pages/api/carSlotApi";
import {
  SyncOutlined,
  LoadingOutlined,
  PrinterOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { formatMoney } from "utils/format";
import { getCarById } from "pages/api/carAPI";
import { getOrderById } from "pages/api/orderAPI";
import { getCustomerById } from "pages/api/customerAPI";
import Loading from "components/Loading";
import Image from "next/image";
import moment from "moment";
import ModalSelectOrder from "components/Modal/ModalSelectOrder";
import { openNotification } from "utils/notification";
import ModalCreateBill from "components/Modal/ModalCreateBill";
import ModalQuestion from "components/Modal/ModalQuestion";
import UpDateServiceOrder from "components/Modal/ModalUpdateServiceOrder";

const formatDate = "HH:mm DD/MM/YYYY";

const CarSlotDetail = ({ carSlotId }) => {
  const { Title } = Typography;
  const { Column, ColumnGroup } = Table;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);

  const [order, setOrder] = useState(null);
  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);

  const [orderSelected, setOrderSelected] = useState(null);

  const [showConfimCancel, setShowConfimCancel] = useState(false);
  const [showConfimComplete, setShowConfimComplete] = useState(false);
  const [showConfimExecute, setShowConfimExecute] = useState(false);
  const [showUpdateServiceOrder, setShowUpdateServiceOrder] = useState(false);

  const [step, setStep] = useState(1);

  const [carSlotDetail, setCarSlotDetail] = useState();

  const fetchCarSlotDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarSlotByCode(carSlotId);
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
      case "IN_USE":
        return (
          <Tag
            style={{
              width: "150px",
              height: "30px",
              padding: "5px",
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

  const handleExecuteOrder = async () => {
    setLoading(true);
    let dataExecute = {
      orderId: orderSelected,
      carSlotId: carSlotDetail?.id,
    };
    try {
      const response = await executeCarSlot(dataExecute);
      openNotification("Thành công!", "Bắt đầu sử lý yêu cầu");

      fetchCarSlotDetail();
      setLoading(false);
    } catch (error) {
      openNotification(err.response.data.message[0]);
      setLoading(false);
    }
  };
  const handleCompleteOrder = async () => {
    setLoading(true);

    let dataComplete = {
      orderId: order?.id,
      carSlotId: carSlotDetail?.id,
      totalExecuteTime: moment().diff(
        moment(carSlotDetail?.orderStartExecuting),
        "minutes"
      ),
    };
    try {
      console.log(dataComplete);
      const response = await completeCarSlot(dataComplete);
      openNotification("Hoàn thành xử lý thành công!", "");
      setLoading(false);
    } catch (error) {
      openNotification(error.response.data.message);
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const response = await cancelCarSlot(carSlotDetail?.id);
      openNotification("Hủy yêu cầu thành công!", "");
      fetchCarSlotDetail();
      setLoading(false);
    } catch (error) {
      openNotification(error.response.data.message);
      setLoading(false);
    }
  };

  const handleSuccessBill = () => {
    setShowCreateBill(false);
    fetchCarSlotDetail();
  };
  console.log("customer", customer);
  console.log("order", order);
  console.log("car", car);

  const handleSuccessUPdateOrder = () => {
    setShowUpdateServiceOrder(false);
    fetchCarSlotDetail();
  };

  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <div className="carslot">
        <div className="carslot-content">
          <div className="carslot-content--header">
            <Title style={{padding:'0px'}} level={3}>{carSlotDetail?.name}</Title>
            <div> {convertStatusCarSlot(carSlotDetail?.status)}</div>
          </div>
          {carSlotDetail?.status == "IN_USE" && (
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
                    <Timeline.Item>Chỗ ngồi: {car?.seats}</Timeline.Item>
                    <Timeline.Item>Biển số: {car?.licensePlate}</Timeline.Item>
                    <Timeline.Item>Màu xe: {car?.color}</Timeline.Item>
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
                    <Steps current={step} className="site-navigation-steps">
                      <Steps.Step
                        title="Tiếp nhận"
                        status="finish"
                        description={
                          moment(order?.createDate).format(formatDate) || ""
                        }
                      />
                      <Steps.Step
                        title="Xử lý"
                        status="process"
                        icon={<LoadingOutlined />}
                        description={
                          moment(carSlotDetail?.orderStartExecuting).format(
                            formatDate
                          ) || ""
                        }
                      />
                      <Steps.Step
                        title="Dự kiến hoàn thành"
                        status="wait"
                        description={moment(carSlotDetail?.orderStartExecuting)
                          .add(totalTimeService(), "m")
                          .format(formatDate)}
                      />
                    </Steps>
                  </Col>
                  <Col span={24}>
                    <Table
                      pagination={false}
                      bordered
                      dataSource={order?.services}
                      summary={() => {
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0}>
                                Tổng
                              </Table.Summary.Cell>
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
                      
                      title={() => (
                        <>
                          <Row>
                            <Col span={12}>
                             <span style={{fontSize:'1rem',font:'bold'}}>Dịch vụ sử dụng</span>
                            </Col>
                            <Col span={12}>
                              <Button
                                style={{ float: "right" }}
                                type="primary"
                                icon={<PlusCircleFilled />}
                                onClick={() => setShowUpdateServiceOrder(true)}
                              >
                                Thêm dịch vụ
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    >
                      <Column
                        title="STT"
                        dataIndex="stt"
                        key="stt"
                        width={70}
                        render={(text, record, dataIndex) => {
                          return <div>{dataIndex + 1}</div>;
                        }}
                      />
                      <Column title="Tên dịch vụ" dataIndex="name" key="name" />
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
                    </Table>
                  </Col>

                  <Col span={24}>
                    <Row className="PullRight">
                      <div
                        style={{ bottom: "0", right: "20px", margin: "10px" }}
                        className="service-action"
                      >
                        <div style={{ marginRight: "20px" }}>
                          <Button
                            onClick={() => {
                              setShowConfimCancel(true);
                            }}
                            size="large"
                            type="primary"
                            danger={true}
                          >
                            Hủy yêu cầu
                          </Button>
                        </div>
                        <div>
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                              setShowConfimComplete(true);
                            }}
                          >
                            Hoàn thành - Xuất hóa đơn
                          </Button>
                        </div>
                      </div>
                    </Row>
                  </Col>
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
                  onSelectOrder={(value) => {
                    setOrderSelected(value);
                    setShowConfimExecute(true);
                  }}
                />
              </Col>
            </Row>
          )}
        </div>
      </div>

      <ModalCreateBill
        order={order}
        show={showCreateBill}
        handleCancel={() => setShowCreateBill(false)}
        onSuccess={() => handleSuccessBill()}
      />
      <ModalQuestion
        title="Bạn có chắc chắn xử lý yêu cầu này?"
        visible={showConfimExecute}
        handleCancel={() => setShowConfimExecute(false)}
        handleOk={() => {
          handleExecuteOrder();
          setShowConfimExecute(false);
        }}
      />
      <ModalQuestion
        title="Bạn có chắc chắn hủy yêu cầu xử lý này?"
        visible={showConfimCancel}
        handleCancel={() => setShowConfimCancel(false)}
        handleOk={() => {
          handleCancelOrder();
          setShowConfimCancel(false);
        }}
      />
      <ModalQuestion
        title="Bạn có chắc chắn hoàn thành xử lý yêu cầu này?"
        visible={showConfimComplete}
        handleCancel={() => setShowConfimComplete(false)}
        handleOk={() => {
          handleCompleteOrder();
          setShowConfimComplete(false);
          setShowCreateBill(true);
        }}
      />
      <UpDateServiceOrder
        show={showUpdateServiceOrder}
        order={order}
        handleCancel={() => setShowUpdateServiceOrder(false)}
        onSuccess={() => handleSuccessUPdateOrder()}
      />

      <Loading loading={loading} />
    </>
  );
};

export default CarSlotDetail;
