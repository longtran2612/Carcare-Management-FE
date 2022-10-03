import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tag } from "antd";
import { getCarSlots } from "pages/api/carSlotApi";
import { useRouter } from "next/router";
import CarSlotDetail from "./CarSlotDetail";
import Image from "next/image";
import slot_active from "public/images/slot_active.png";
import slot_available from "public/images/slot_available.png";
import slot_unavailable from "public/images/slot_unavailable.png";
import Loading from "components/Loading";

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
        return <Image height={200} width={200} src={slot_unavailable} />;
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
                  <Card
                    headStyle={{
                      backgroundColor: "#8CB3F1",
                      color: "white",
                      textAlign: "center",
                      fontSize:'20px'
                    }}
                    bodyStyle={{ height: "35vh", borderRadius: "5px" }}
                    hoverable
                    title={carSlot.name}
                    bordered={false}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      {convertStatusCarSlotImg(carSlot.status)}
                    </div>
                    {carSlot.status == "ACTIVE" && (
                      <div className="card-slot">
                        <div><p>Khách hàng: {carSlot.car.user.name}</p></div>
                        <div> </div>
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
