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
import { getCarSlotDetail } from "pages/api/carSlotApi";
import { SyncOutlined, LoadingOutlined } from "@ant-design/icons";
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

  const [step, setStep] = useState(1);

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

  const totalTimeService = () => {
    return selectedRows.reduce((total, cur) => {
      return (total += cur.estimateTime);
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
              <Col span={6}>
                <div className="carslot-customer content-white">
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
                        description="Thời gian tiếp nhận yêu cầu"
                      />
                      <Steps.Step
                        title="Xử lý"
                        status="process"
                        icon={<LoadingOutlined />}
                        description="Thời gian sử lý yêu cầu"
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
                      dataSource={carSlotDetail?.serviceProfileList}
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
                              ></Table.Summary.Cell>
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
                        <Column title="Thời gian sử lý"></Column>
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
