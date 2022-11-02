import React, { useEffect, useState } from "react";
import { getOrders } from "pages/api/orderAPI";
import Loading from "components/Loading";
import {
  List,
  Col,
  Row,
  Typography,
  Tag,
  Drawer,
  Divider,
  Table,
  Column,
  Button,
  Avatar,
} from "antd";
import { SyncOutlined, TagsOutlined } from "@ant-design/icons";
import { formatMoney } from "utils/format";
import { getAllPromotionUseable } from "pages/api/promotionDetail";
import moment from "moment";
import Image from "next/image";
import Cookies from "js-cookie";
import slot_active from "public/images/slot_active.gif";
import order_cancel from "public/images/order_cancel.png";
import order_complete from "public/images/order_complete.gif";
const { Title } = Typography;
const formatDate = "HH:mm DD/MM/YYYY";

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p
      style={{ font: "bold" }}
      className="site-description-item-profile-p-label"
    >
      {title}:
    </p>
    {content}
  </div>
);
const ServiceCustomer = ({status}) => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [promotionDetails, setPromotionDetails] = useState([]);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false);
  const handleGetOrders = async () => {
    setLoading(true);
    const username = Cookies.get("username");
    let dataGetOrder = {
      keyword: username,
      pageSize: 20,
      pageNumber: 0,
      status: status,
      sort: [
        {
          key: "createDate",
          asc: true,
        },
      ],
    };
    try {
      const res = await getOrders(dataGetOrder);
      console.log(res.data.Data);
      setOrders(res.data.Data.content);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleFetchPromotion = async () => {
    try {
      const res = await getAllPromotionUseable(orderDetail?.id);
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPriceService = () => {
    return orderDetail?.services?.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };
  const totalTimeService = () => {
    return orderDetail?.services?.reduce((total, cur) => {
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

  const convertOrderStatus = (status) => {
    console.log("statusss", status);
    switch (status) {
      case 100:
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
      case 2:
        return (
          <Tag
            style={{
              height: "30px",
              padding: "5px",
              fontSize: "15px",
            }}
            icon={<SyncOutlined spin />}
            color="processing"
          >
            Đang xử lý
          </Tag>
        );
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, [status]);

  useEffect(() => {
    if (orderDetail) {
      handleFetchPromotion();
    }
  }, [orderDetail]);

  const handleImage = (status) => {
    switch (status) {
      case -100:
        return <Image height={170} width={170} src={order_cancel} />;
      case 10:
        return <Image height={170} width={170} src={order_complete} />;
      case 2:
        return <Image height={170} width={170} src={slot_active} />;
      default:
        break;
    }
  };

  return (
    <>
      <List
        itemLayout="vertical"
        size="small"
        pagination={{
          pageSize: 3,
        }}
        style={{ overflow: "auto", height: "520px" }}
        dataSource={orders}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            onClick={() => {
              setOrderDetail(item);
              setShowDetail(true);
            }}
            extra={handleImage(item.status)}
            style={{
              cursor: "pointer",
              border: "1px solid #9B9A9A",
              margin: "10px",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0px 0px 3px 0px #9B9A9A",
              backgroundColor: "white",
            }}
          >
            <List.Item.Meta
              title={
                <Typography.Title style={{ color: "#1C1266" }} level={5}>
                  #{item.orderCode}
                </Typography.Title>
              }
            />
            <Row gutter={16}>
              {/* <Col span={8}>
                <DescriptionItem title="Mã xe" content={item.carCode} />
              </Col> */}
              <Col span={8}>
                <DescriptionItem title="Tên xe" content={item.carName} />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Biển số"
                  content={item.carLicensePlate}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Trạng thái"
                  content={convertOrderStatus(item?.status)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Tổng tiền dịch vụ"
                  content={formatMoney(item.totalServicePrice)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Thời gian xử lý ước tính"
                  content={item.totalEstimateTime + " phút"}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <DescriptionItem
                  title="Thời gian tiếp nhận yêu cầu"
                  content={moment(item.createDate).format(formatDate)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Thời gian bắt đầu xử lý"
                  content={moment(item.carExecutingDate).format(formatDate)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Thời gian hoàn thành dự kiến"
                  content={moment(item?.carExecutingDate)
                    .add(item?.totalEstimateTime, "m")
                    .format(formatDate)}
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />

      <Drawer
        title="Chi tiết yêu cầu"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width={900}
      >
        <Divider>
          <Title level={5}>Yêu cầu :# {orderDetail.orderCode}</Title>
        </Divider>
        <Row gutter={[16, 32]}>
          {/* <Col span={8}>
            <DescriptionItem title="Mã xe" content={billDetail.carCode} />
          </Col> */}
          <Col span={12}>
            <DescriptionItem title="Tên xe" content={orderDetail.carName} />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Biển số"
              content={orderDetail.carLicensePlate}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Tiếp nhận yêu cầu"
              content={moment(orderDetail.createDate).format(formatDate)}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Bắt đầu xử lý"
              content={moment(orderDetail.carExecutingDate).format(formatDate)}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Hoàn thành dự kiến"
              content={moment(orderDetail?.carExecutingDate)
                .add(orderDetail?.totalEstimateTime, "m")
                .format(formatDate)}
            />
          </Col>

          <Table
            size="small"
            pagination={false}
            bordered
            dataSource={orderDetail?.services}
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
                        description={
                          <Title level={5}>{item.description}</Title>
                        }
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
      </Drawer>

      <Loading loading={loading} />
    </>
  );
};

export default ServiceCustomer;
