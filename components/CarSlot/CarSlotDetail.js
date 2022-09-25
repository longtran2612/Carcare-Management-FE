import React, { useState, useEffect } from "react";
import { Tag, Row, Col, Typography, Table, Timeline, Button } from "antd";
import { getCarSlotDetail } from "api/carSlotApi";
import {useRouter} from "next/router"

const CarSlotDetail = ({ carSlotId }) => {
  const { Title } = Typography;
    const { Column, ColumnGroup } = Table;
    const router = useRouter()

  const [carSlotDetail, setCarSlotDetail] = useState();
  const fetchCarSlotDetail = async () => {
    try {
      const response = await getCarSlotDetail(carSlotId);
      setCarSlotDetail(response.data.Data);
    } catch (error) {
      console.log(error);
    }
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
                  <div style={{ textAlign: "right" }}>Tổng tiền: 100k</div>
                )}
              >
                <Column
                  title="STT"
                  dataIndex="stt"
                  key="stt"
                  render={(text, record, dataIndex) => {
                    return <div>{dataIndex + 1}</div>;
                  }}
                />
                <ColumnGroup title="Dịch vụ sử dụng">
                  <Column
                    title="Tên dịch vụ"
                    dataIndex="serviceId"
                    key="serviceId"
                  />
                  <Column title="Giá dịch vụ" dataIndex="id" key="id" />
                </ColumnGroup>
              </Table>
            </Col>
            <Col flex={1}>
              <div className="carslot-customer">
                <Title level={4}>Thông tin khách hàng</Title>
                <Timeline>
                  <Timeline.Item>
                    Create a services site 2015-09-01
                  </Timeline.Item>
                  <Timeline.Item>
                    Solve initial network problems 2015-09-01
                  </Timeline.Item>
                  <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                  <Timeline.Item>
                    <Timeline>
                      <Timeline.Item>
                        Create a services site 2015-09-01
                      </Timeline.Item>
                      <Timeline.Item>
                        Solve initial network problems 2015-09-01
                      </Timeline.Item>
                      <Timeline.Item>
                        Technical testing 2015-09-01
                      </Timeline.Item>
                      <Timeline.Item>
                        Network problems being solved 2015-09-01
                      </Timeline.Item>
                    </Timeline>
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
