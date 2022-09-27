import React, { useState, useEffect } from "react";
import { Tag, Row, Col, Typography, Table, Timeline, Button } from "antd";
import { getCarSlotDetail } from "pages/api/carSlotApi";
import { useRouter } from "next/router";
import { formatMoney } from "utils/format";

const CarSlotDetail = ({ carSlotId }) => {
  const { Title } = Typography;
  const { Column, ColumnGroup } = Table;
  const router = useRouter();

  const [carSlotDetail, setCarSlotDetail] = useState();
  const fetchCarSlotDetail = async () => {
    try {
      const response = await getCarSlotDetail(carSlotId);
      setCarSlotDetail(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPriceService = () => {
    return carSlotDetail?.serviceProfileList?.reduce((total, cur) => {
      return (total += cur.price.price);
    }, 0);
  };

  useEffect(() => {
    if (carSlotId) {
      fetchCarSlotDetail();
    }
  }, [carSlotId]);

  const convertStatusCarSlot = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <Tag color="green">Chưa sử dụng</Tag>;
      case "BOOKED":
        return <Tag color="red">Đã đặt trước</Tag>;
      case "IN_USE":
        return <Tag color="blue">Đang sử dụng</Tag>;
      default:
        break;
    }
  };
  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <div className="carslot">
        <div className="carslot-content">
          <div className="carslot-content--header">
            <Title level={3}>{carSlotDetail?.name}</Title>
            {convertStatusCarSlot(carSlotDetail?.status)}
          </div>
          <Row>
            <Col flex={4}>
              <Table
                footer={() => (
                  <div style={{ textAlign: "right" }}>
                    Tổng tiền: {formatMoney(totalPriceService() || 0)}
                  </div>
                )}
                dataSource={carSlotDetail?.serviceProfileList}
              >
                <ColumnGroup title="Dịch vụ sử dụng">
                  <Column
                    title="STT"
                    dataIndex="stt"
                    key="stt"
                    render={(text, record, dataIndex) => {
                      return <div>{dataIndex + 1}</div>;
                    }}
                  />
                  <Column title="Tên dịch vụ" dataIndex="name" key="name" />
                  <Column
                    title="Giá dịch vụ"
                    dataIndex="price"
                    key="price"
                    render={(text, record, dataIndex) => {
                      return <div>{formatMoney(record.price.price)}</div>;
                    }}
                  />
                </ColumnGroup>
              </Table>
            </Col>
            <Col flex={1}>
              <div className="carslot-customer">
                <Title level={4}>Thông tin khách hàng</Title>
                <Timeline>
                  <Timeline.Item>
                    Tên: {carSlotDetail?.car?.user?.name}
                  </Timeline.Item>
                  <Timeline.Item>
                    Số điện thoại: {carSlotDetail?.car?.user?.phone}
                  </Timeline.Item>
                </Timeline>
                <Title level={4}>Thông tin xe</Title>
                <Timeline>
                  <Timeline.Item>
                    Tên xe: {carSlotDetail?.car?.carModel?.name}
                  </Timeline.Item>
                  <Timeline.Item>
                    Nhãn hiệu: {carSlotDetail?.car?.carModel?.brand}
                  </Timeline.Item>
                  <Timeline.Item>
                    Loại xe: {carSlotDetail?.car?.carModel?.model}
                  </Timeline.Item>
                  <Timeline.Item>
                    Nhiên liệu: {carSlotDetail?.car?.carModel?.fuel}
                  </Timeline.Item>
                  <Timeline.Item>
                    Hộp số: {carSlotDetail?.car?.carModel?.transmission}
                  </Timeline.Item>
                  <Timeline.Item>
                    Chỗ ngồi: {carSlotDetail?.car?.carModel?.seats}
                  </Timeline.Item>
                  <Timeline.Item>
                    Biển số: {carSlotDetail?.car?.licensePlate}
                  </Timeline.Item>
                  <Timeline.Item>
                    Màu xe: {carSlotDetail?.car?.color}
                  </Timeline.Item>
                  <Timeline.Item>
                    Mô tả: {carSlotDetail?.car?.description}
                  </Timeline.Item>
                </Timeline>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CarSlotDetail;
