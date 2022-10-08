import React, { useState, useEffect } from "react";
import { Tag, Row, Col, Typography, Table, Timeline, Button, Card } from "antd";
import { getCarSlotDetail } from "pages/api/carSlotApi";
import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { formatMoney } from "utils/format";
import Loading from "components/Loading";
import Image from "next/image";
// import slot_active from "public/images/slot_active.png";
import select_order from "public/images/select_order.png";
import OrderTable from "components/Order/OrderTable";

const CarSlotDetail = ({ carSlotId }) => {
  const { Title } = Typography;
  const { Column, ColumnGroup } = Table;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [carSlotDetail, setCarSlotDetail] = useState();

  const fetchCarSlotDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarSlotDetail(carSlotId);
      setCarSlotDetail(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
                    {/* <Timeline.Item>
                    Hộp số: {carSlotDetail?.car?.carModel?.transmission}
                  </Timeline.Item> */}
                    <Timeline.Item>
                      Chỗ ngồi: {carSlotDetail?.car?.carModel?.seats}
                    </Timeline.Item>
                    <Timeline.Item>
                      Biển số: {carSlotDetail?.car?.licensePlate}
                    </Timeline.Item>
                    <Timeline.Item>
                      Màu xe: {carSlotDetail?.car?.color}
                    </Timeline.Item>
                    {/* <Timeline.Item>
                    Mô tả: {carSlotDetail?.car?.description}
                  </Timeline.Item> */}
                  </Timeline>
                </div>
              </Col>
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
                <Button
                  style={{ position: "absolute", right: "20px", bottom: "0" }}
                  type="primary"
                  size="large"
                >
                  Hoàn thành - Xuất hóa đơn
                </Button>
              </Col>
            </Row>
          )}
          {carSlotDetail?.status == "AVAILABLE" && (
            <Row span={24}>
              <Col span={24}>
                <Col span={24}>
                  <h3>
                    Vị trí đang trống!!! 
                    Vui lòng chọn yêu cầu cần xử lý
                  </h3>
                </Col>
              </Col>
              <Col span={6}>
                <Image src={select_order} />
              </Col>
              <Col span={18}>
                <OrderTable />
              </Col>
            </Row>

            // <Row style={{display:'flex',justifyContent:"center",alignItems:'center',marginTop:'50px'}}>
            //   <Card  headStyle={{

            //           textAlign: "center",
            //           fontSize:'20px'
            //         }}
            //         bodyStyle={{ height: "35vh", borderRadius: "5px" }}
            //         hoverable
            //         title="Sử lý yêu cầu chăm sóc xe mới"
            //         bordered={false}
            //       >
            //     <div
            //       style={{
            //         display: "flex",
            //         justifyContent: "center",
            //         alignContent: "center",
            //       }}

            //     >
            //        <Image height={200} width={200} src={slot_active} />;
            //     </div>
            //   </Card>
            // </Row>
          )}
        </div>
      </div>

      <Loading loading={loading} />
    </>
  );
};

export default CarSlotDetail;
