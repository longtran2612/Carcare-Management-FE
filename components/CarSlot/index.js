import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tag } from "antd";
import { getCarSlots } from "pages/api/carSlotApi";
import { useRouter } from "next/router";
import CarSlotDetail from "./CarSlotDetail";

const CarSlot = () => {
  const router = useRouter();
  const { carSlotId } = router.query;
  const [carSlots, setCarSlots] = useState([]);

  const fetchCarSlots = async () => {
    try {
      const response = await getCarSlots();
      setCarSlots(response.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    fetchCarSlots();
  }, []);

  return (
    <>
      {carSlotId ? (
        <CarSlotDetail carSlotId={carSlotId} />
      ) : (
        <div className="site-card-border-less-wrapper">
          <Row gutter={16}>
            {carSlots?.map((carSlot) => {
              return (
                <Col
                  key={carSlot.id}
                  span={12}
                  style={{ marginBottom: "10px" }}
                  onClick={() => router.push(`/admin?carSlotId=${carSlot.id}`)}
                >
                  <Card hoverable title={carSlot.name} bordered={false}>
                    <p>{convertStatusCarSlot(carSlot.status)}</p>
                    {carSlot.status != "AVAILABLE" && (
                      <div className="card-slot">
                        <div>Dich vu</div>
                        <div>Khach Hang</div>
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </>
  );
};

export default CarSlot;
