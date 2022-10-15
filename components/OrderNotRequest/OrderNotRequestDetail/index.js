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
  Tag,
} from "antd";
import { getOrderById } from "pages/api/orderAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

export const OrderNotRequestDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  const getOrder = async () => {
    const res = await getOrderById(orderId);
    setOrder(res.data.Data);
  };

  useEffect(() => {
    getOrder();
  }, []);
  const totalPriceService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur.servicePrice.price);
    }, 0);
  };
  const totalTimeService = () => {
    return order?.services.reduce((total, cur) => {
      return (total += cur.estimateTime);
    }, 0);
  };

  console.log("order", order);
  return (
    <>
      <Col span={24}>
        <Title level={4}>Thông tin hóa đơn</Title>
        <Row gutter={16}>
          <Col span={24}>
            <Tag className="PullRight" color="blue">
              {order?.statusName}
            </Tag>
            <Table
              pagination={false}
              summary={() => {
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
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
              dataSource={order?.services}
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
                <Column title="Tên dịch vụ" dataIndex="name" key="name" />
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
                    return <div>{formatMoney(record.servicePrice.price)}</div>;
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
                <Col style={{ borderRight: "solid LightGray 1px" }} span={8}>
                  <Title style={{ textAlign: "center" }} level={4}>
                    Khách hàng
                  </Title>
                  <Divider />
                  <Timeline style={{ marginTop: "20px" }}>
                    <Timeline.Item>Mã: {order?.customerCode}</Timeline.Item>
                    <Timeline.Item>Tên: {order?.customerName}</Timeline.Item>
                    <Timeline.Item>
                      Số điện thoại: {order?.customerPhoneNumber}
                    </Timeline.Item>
                  </Timeline>
                </Col>
                <Col style={{ borderRight: "solid LightGray 1px" }} span={8}>
                  <Title style={{ textAlign: "center" }} level={4}>
                    Xe
                  </Title>
                  <Divider />
                  <Timeline style={{ marginTop: "20px" }}>
                    <Timeline.Item>Mã: {order?.carCode}</Timeline.Item>
                    <Timeline.Item>Xe: {order?.carName}</Timeline.Item>
                    <Timeline.Item>
                      Biển số: {order?.carLicensePlate}
                    </Timeline.Item>
                  </Timeline>
                </Col>
                <Col style={{ borderRight: "solid LightGray 1px" }} span={8}>
                  <Title style={{ textAlign: "center" }} level={4}>
                    Thông tin
                  </Title>

                  <Divider />
                  <Timeline style={{ marginTop: "20px" }}>
                    <Timeline.Item>
                      Thời gian nhận xe dự kiến:{" "}
                      {moment(order?.estimateReceiveDate).format(formatDate)}{" "}
                    </Timeline.Item>
                    <Timeline.Item>
                      Thời gian sử lý dự kiến:{" "}
                      {moment(order?.estimateExecuteDate).format(formatDate)}
                    </Timeline.Item>
                    <Timeline.Item>
                      Thời gian hoàn thành dự kiến:
                      {moment(order?.estimateDeliverDate).format(formatDate)}
                    </Timeline.Item>
                  </Timeline>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
    </>
  );
};
