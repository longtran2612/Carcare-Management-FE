import { Card, Row, Col, Typography, Modal } from "antd";
import { getCarSlots } from "pages/api/carSlotApi";
import React, { useState, useEffect, useRef } from "react";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import slot_active from "public/images/slot_active.png";
import slot_available from "public/images/slot_available.png";
import Image from "next/image";
import { executeCarSlot } from "pages/api/carSlotApi";
import { openNotification } from "utils/notification";

const { Title } = Typography;

function ModalSelectSlot({ onSelectOrder, show, onSuccess, handleCancel }) {
  const [loading, setLoading] = useState(false);

  const [carSlots, setCarSlots] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    console.log(values);
    let data = {
      carSlotId: values,
      orderId: onSelectOrder,
    };
    console.log(data);
    try {
      const response = await executeCarSlot(data);
      openNotification("Thành công!", "Bắt đầu sử lý yêu cầu ở vị trí: "+ carSlots.find((item) => item.id === values).name);
      handleCancel();
      onSuccess();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarSlots();
  }, []);

  const fetchCarSlots = async () => {
    setLoading(true);
    try {
      const response = await getCarSlots();
      setCarSlots(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      openNotification(err.response.data.message[0]);
    }
  };

  const convertStatusCarSlotImg = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Image height={100} width={100} src={slot_active} />;
      case "AVAILABLE":
        return <Image height={100} width={100} src={slot_available} />;
      case "IN_USE":
        return <Image height={100} width={100} src={slot_active} />;
      default:
        break;
    }
  };

  return (
    <>
      <Modal
        title="Chọn vị trí xử lý xe"
        visible={show}
        onCancel={handleCancel}
        width={700}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Row style={{ backgroundColor: "#C5C5C5" }} gutter={[16]}>
          {carSlots?.map((carSlot) => {
            return (
              <Col
                key={carSlot.id}
                xs={24}
                sm={24}
                md={12}
                lg={8}
                style={{ marginBottom: "10px" }}
                onClick={() => onFinish(carSlot.id)}
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
                    height: "200px",
                  }}
                  hoverable
                  title={carSlot.name}
                  bordered={false}
                >
                  {carSlot.status == "IN_USE" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      {convertStatusCarSlotImg(carSlot.status)}
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
      </Modal>

      <Loading loading={loading} />
    </>
  );
}

export default ModalSelectSlot;
