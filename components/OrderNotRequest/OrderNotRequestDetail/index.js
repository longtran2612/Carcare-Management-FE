import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  Timeline,
  Table,
  Button,
  Tag,
  Steps,
  Drawer,
  Avatar,
  List,
} from "antd";
import {
  LoadingOutlined,
  TagsOutlined,
  SyncOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { getOrderById } from "pages/api/orderAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import ModalCreateBill from "components/Modal/ModalCreateBill";
import moment from "moment";
import { useRouter } from "next/router";
import { openNotification } from "utils/notification";
import UpDateServiceOrder from "components/Modal/ModalUpdateServiceOrder";
import { getAllPromotionUseable } from "pages/api/promotionDetail";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

export const OrderNotRequestDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showCreateBill, setShowCreateBill] = useState(false);

  const [step, setStep] = useState(0);

  const [showUpdateServiceOrder, setShowUpdateServiceOrder] = useState(false);

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);

  const getOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(orderId);
      setOrder(res.data.Data);
      setLoading(false);
    } catch (error) {
      openNotification(error.response.data.message[0]);
      setLoading(false);
    }
  };
  const handleFetchPromotion = async () => {
    try {
      const res = await getAllPromotionUseable(order?.id);
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [orderId]);

  useEffect(() => {
    handleStep();
    handleFetchPromotion();
  }, [order]);

  const handleStep = () => {
    switch (order?.status) {
      case 1:
        setStep(0);
      case 2:
        setStep(1);
      case 10:
        setStep(2);
      case 100:
        setStep(3);
      case -100:
        setStep(2);
    }
  };

  const handleSuccessBill = () => {
    setShowCreateBill(false);
    getOrder();
  };
  const totalPriceService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };
  const totalTimeService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur?.estimateTime);
    }, 0);
  };

  const totalPromotionAmount = () => {
    let totalPromotion = 0;
    promotionDetails.forEach((promotion) => {
      if (promotion.type === "PERCENTAGE") {
        let total = (totalPriceService() * promotion.amount) / 100;
        if (total > promotion.maximumDiscount) {
          totalPromotion += promotion.maximumDiscount;
        } else {
          totalPromotion += total;
        }
      } else {
        if (promotion.type === "MONEY") {
          totalPromotion += promotion.amount;
        }
      }
    });
    return totalPromotion;
  };
  const finalTotalPrice = () => {
    let total = totalPriceService() - totalPromotionAmount();
    return total;
  };

  const convertOrderStatus = () => {
    switch (order?.status) {
      case 1:
        return (
          <Tag
            tyle={{
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            color="white"
          >
            Chờ xử lý
          </Tag>
        );
      case 2:
        return (
          <Tag
            style={{
              height: "30px",
              alignItems: "center",
              fontSize: "15px",
            }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Đang xử lý
          </Tag>
        );
      case 10:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="green"
          >
            Đã hoàn thành
          </Tag>
        );
      case 100:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="pink"
          >
            Đã xuất hóa đơn
          </Tag>
        );
      case -100:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            color="red"
          >
            Đã hủy
          </Tag>
        );
    }
  };
  const handleSuccessUPdateOrder = () => {
    setShowUpdateServiceOrder(false);
    getOrder();
  };

  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <div className="carslot-content--header">
        <Title style={{ padding: "0px" }} level={3}>
          Thông tin đơn hàng{" "}
          <span style={{ color: "blue" }}>#{order?.orderCode}</span>
        </Title>
        <div> {convertOrderStatus()}</div>
      </div>
      <Row>
        <Col span={6}>
          <div
            style={{ marginRight: "10px" }}
            className="carslot-customer content-white"
          >
            <Title level={4}>Thông tin khách hàng</Title>
            <Timeline>
              <Timeline.Item>Mã: {order?.customerCode}</Timeline.Item>
              <Timeline.Item>Tên: {order?.customerName}</Timeline.Item>
              <Timeline.Item>
                Số điện thoại: {order?.customerPhoneNumber}
              </Timeline.Item>
            </Timeline>
            <Title level={4}>Thông tin xe</Title>
            <Timeline>
              <Timeline.Item>Mã xe: {order?.carCode}</Timeline.Item>
              <Timeline.Item>Tên xe: {order?.carName}</Timeline.Item>
              <Timeline.Item>Biển số: {order?.carLicensePlate}</Timeline.Item>
            </Timeline>
            {order?.status === 10 && (
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      setShowCreateBill(true);
                    }}
                  >
                    Xuất hóa đơn
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col span={18}>
          <Row>
            {order?.status === -100 ? (
              <Col
                className="content-white"
                style={{ marginBottom: "1rem", margin: 0 }}
                span={24}
              >
                <Steps current={step} className="site-navigation-steps">
                  <Steps.Step
                    title="Tiếp nhận yêu cầu"
                    status="finish"
                    description={
                      moment(order?.createDate).format(formatDate) || ""
                    }
                  />
                  <Steps.Step
                    title="Hủy yêu cầu"
                    description={
                      order?.orderCanceledDate != null
                        ? moment(order?.orderCanceledDate).format(formatDate)
                        : ""
                    }
                  />
                </Steps>
              </Col>
            ) : (
              <Col
                className="content-white"
                style={{ marginBottom: "1rem" }}
                span={24}
              >
                <Steps current={step} className="site-navigation-steps">
                  <Steps.Step
                    title="Tiếp nhận yêu cầu"
                    status="finish"
                    description={
                      moment(order?.createDate).format(formatDate) || ""
                    }
                  />
                  <Steps.Step
                    title="Băt đầu xử lý"
                    description={
                      order?.carExecutingDate != null
                        ? moment(order?.carExecutingDate).format(formatDate)
                        : ""
                    }
                  />
                  <Steps.Step
                    title="Hoàn thành"
                    description={
                      order?.carExecutedDate != null
                        ? moment(order?.carExecutedDate).format(formatDate)
                        : ""
                    }
                  />
                  <Steps.Step
                    title="Thanh toán"
                    description={
                      order?.paymentDate != null
                        ? moment(order?.paymentDate).format(formatDate)
                        : ""
                    }
                  />
                </Steps>
              </Col>
            )}

            <Col span={24}>
              <Table
                size="small"
                pagination={false}
                bordered
                dataSource={order?.services}
                scroll={{ y: 260 }}
                summary={() => {
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#E34262",
                            }}
                          >
                            Tổng dịch vụ
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#E34262",
                            }}
                          >
                            {totalTimeService() || 0} phút
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#E34262",
                            }}
                          >
                            {formatMoney(totalPriceService() || 0)}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Button
                            icon={<TagsOutlined />}
                            type="ghost"
                            style={{
                              backgroundColor: "#B6D433",
                              color: "white",
                            }}
                            onClick={() => setShowSelectPromotion(true)}
                          >
                            Danh sách khuyến mãi
                          </Button>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#677E31",
                            }}
                          >
                            Tổng tiền khuyến mãi
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#677E31",
                            }}
                          >
                            {formatMoney(totalPromotionAmount() || 0)}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Tổng thanh toán (tạm tính)
                          </span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                          {" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "red",
                            }}
                          >
                            {formatMoney(finalTotalPrice() || 0)}
                          </span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
                title={() => (
                  <>
                    <Row>
                      <Col span={12}>
                        <span style={{ fontSize: "1rem", font: "bold" }}>
                          Dịch vụ sử dụng
                        </span>
                      </Col>
                      {order?.status === 1 ||
                        (order?.status === 2 && (
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
                        ))}
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
                      <div>{formatMoney(record?.servicePrice?.price || 0)}</div>
                    );
                  }}
                />
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
      <Drawer
        title="Danh sách khuyến mãi được áp dụng"
        placement="right"
        onClose={() => setShowSelectPromotion(false)}
        visible={showSelectPromotion}
        width={700}
      >
        <>
          <List
            dataSource={promotionDetails}
            itemLayout="vertical"
            size="large"
            renderItem={(item) => (
              <Row gutter={16}>
                <Col
                  style={{
                    border: "solid gray 1px",
                    borderRadius: "5px",
                    margin: "10px",
                  }}
                  span={24}
                >
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={{
                            xs: 24,
                            sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                          icon={<TagsOutlined />}
                        />
                      }
                      title={<a>{item.name}</a>}
                      description={<Title level={5}>{item.description}</Title>}
                    />
                    <Row>
                      {item.type === "PERCENTAGE" ? (
                        <Col span={24}>
                          {" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Giảm {item.amount}%{" "}
                          </span>
                        </Col>
                      ) : (
                        <Col span={24}>
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Giảm {formatMoney(item.amount || 0)}{" "}
                          </span>
                        </Col>
                      )}
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>
                          Số tiền đơn hàng tối thiểu:{" "}
                        </span>
                        {formatMoney(item.minimumSpend || 0)}
                      </Col>
                      {item.type === "PERCENTAGE" && (
                        <Col span={12}>
                          <span style={{ fontWeight: "bold" }}>
                            Giảm tối đa:{" "}
                          </span>
                          {formatMoney(item.maximumDiscount || 0)}
                        </Col>
                      )}
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>
                          Ngày bắt đầu:{" "}
                        </span>
                        {moment(item.fromDate).format("DD/MM/YYYY")}
                      </Col>
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>Kết thúc: </span>
                        {moment(item.toDate).format("DD/MM/YYYY")}
                      </Col>
                    </Row>
                  </List.Item>
                </Col>
              </Row>
            )}
          />
        </>
      </Drawer>
      <UpDateServiceOrder
        show={showUpdateServiceOrder}
        order={order}
        handleCancel={() => setShowUpdateServiceOrder(false)}
        onSuccess={() => handleSuccessUPdateOrder()}
      />
      <ModalCreateBill
        order={order}
        show={showCreateBill}
        handleCancel={() => setShowCreateBill(false)}
        onSuccess={() => handleSuccessBill()}
      />
      <Loading loading={loading} />
    </>
  );
};
