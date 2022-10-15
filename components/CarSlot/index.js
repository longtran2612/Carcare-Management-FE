import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tag, Timeline } from "antd";
import { getCarSlots } from "pages/api/carSlotApi";
import { useRouter } from "next/router";
import CarSlotDetail from "./CarSlotDetail";
import Image from "next/image";
import slot_active from "public/images/slot_active.png";
import slot_available from "public/images/slot_available.png";
import slot_unavailable from "public/images/slot_unavailable.png";
import Loading from "components/Loading";
import {
  UserOutlined,
  CarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const CarSlot = () => {
  const router = useRouter();
  const { carSlotId } = router.query;
  const [carSlots, setCarSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCarSlots = async () => {
    setLoading(true);
    try {
      const response = await getCarSlots();
      setCarSlots(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log("carSlots", carSlots);

  const convertStatusCarSlot = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Tag color="green">Chưa sử dụng</Tag>;
      case "AVAILABLE":
        return <Tag color="red">Đã đặt trước</Tag>;
      case "IN_USE":
        return <Tag color="blue">Đang sử dụng</Tag>;
      default:
        break;
    }
  };
  const convertStatusCarSlotImg = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Image height={200} width={200} src={slot_active} />;
      case "AVAILABLE":
        return <Image height={200} width={200} src={slot_available} />;
      case "IN_USE":
        return <Image height={200} width={200} src={slot_active} />;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchCarSlots();
  }, [carSlotId]);

  return (
    <>
      {carSlotId ? (
        <CarSlotDetail carSlotId={carSlotId} />
      ) : (
        <div className="site-card-border-less-wrapper">
          <Row gutter={[16]}>
            {carSlots?.map((carSlot) => {
              return (
                <Col
                  key={carSlot.id}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  style={{ marginBottom: "10px" }}
                  onClick={() =>
                    router.push(`/admin?carSlotId=${carSlot.carSlotCode}`)
                  }
                >
                  <Card
                    headStyle={{
                      backgroundColor: "#8CB3F1",
                      color: "white",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                    }}
                    style={{
                      margin: "10px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      cursor: "pointer",
                      height: "300px",
                    }}
                    hoverable
                    title={carSlot.name}
                    bordered={false}
                  >
                    {carSlot.status == "IN_USE" ? (
                      <div className="card-slot">
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignContent: "center",
                            }}
                          >
                            {convertStatusCarSlotImg(carSlot.status)}
                          </div>
                        </div>

                        <div>
                          <Timeline>
                            <Timeline.Item dot={<UserOutlined />}>
                              {carSlot?.orderCustomerName}
                            </Timeline.Item>
                            <Timeline.Item>
                              {carSlot?.orderCustomerPhoneNumber}
                            </Timeline.Item>
                            <Timeline.Item dot={<CarOutlined />}>
                              {carSlot?.orderCarLicensePlate}
                            </Timeline.Item>
                            <Timeline.Item dot={<FieldTimeOutlined />}>
                              {carSlot?.orderTotalEstimateTime} phút
                            </Timeline.Item>
                          </Timeline>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                          }}
                        >
                          {convertStatusCarSlotImg(carSlot.status)}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      <Loading loading={loading} />
    </>
  );
};

export default CarSlot;
