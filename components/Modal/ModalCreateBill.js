import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  Typography,
  Steps,
  Button,
  DatePicker,
  Divider,
  Timeline,
  Card,
  Table,
} from "antd";
import { getPromotionDetail } from "pages/api/promotionDetail";
import { createBill } from "pages/api/billAPI";
import { getCarbyCustomerId } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import ServiceOrder from "./ModalService";
import { formatMoney } from "utils/format";
import moment from "moment";
import promotion_gif from "public/images/promotion.gif";
import Image from "next/image";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

const ModalCreateBill = ({ order, show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [promotionSelected, setPromotionSelected] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleFetchPromotion = async () => {
    try {
      const res = await getPromotionDetail();
      setPromotionDetails(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchCar = async () => {
    try {
      const res = await getCarbyCustomerId(form.getFieldValue("customerId"));
      setCars(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchPromotion();
    }
  }, [show]);

  const totalPriceService = () => {
    return order?.services?.reduce((total, cur) => {
      return (total += cur.servicePrice.price);
    }, 0);
  };
  const totalPromotionAmount = () => {};

  const onFinish = async (values) => {
    const dataCreateBill = {
      orderId: order.id,
      promotionCodes: values.promotion,
      totalPromotionAmount: totalPromotionAmount(),
      paymentAmount: paymentAmount,
      paymentType: values.paymentType,
      cardNumber: values.cardNumber,
    };

    try {
      const res = await createBill(dataCreateBill);
      openNotification("Thành công!", "Tạo hóa đơn thành công!");
      handleCancel();
      onSuccess(res.data);
    } catch (error) {
      openNotification(error.response.data.message[0]);
    }
  };
  return (
    <>
      <Modal
        title="Tạo hóa đơn"
        visible={show}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={handleCancel}
        width={1000}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
        >
          <Row gutter={[16]}>
            <Col span={24}>
              <Col span={24}>
                <Title level={4}>Thông tin yêu cầu</Title>
                <Row gutter={16}>
                  <Col span={24}>
                    <Table
                      size="small"
                      pagination={false}
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
                              >Tổng tiền dịch vụ</Table.Summary.Cell>
                              <Table.Summary.Cell index={3}>
                                {formatMoney(totalPriceService() || 0)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={1}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={2}
                              >Triết khấu</Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                - {formatMoney(paymentAmount || 0)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={1}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={2}
                              >Tổng</Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                {formatMoney(paymentAmount || 0)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                      dataSource={order?.services}
                      bordered
                      scroll={{
                        y: 250,
                      }}
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
                      <Column
                        title="Mã dịch vụ"
                        dataIndex="serviceCode"
                        key="serviceCode"
                      />
                      <Column title="Tên dịch vụ" dataIndex="name" key="name" />
                      <Column
                        title="Giá dịch vụ"
                        dataIndex="price"
                        key="price"
                        render={(text, record, dataIndex) => {
                          return (
                            <div>{formatMoney(record.servicePrice.price)}</div>
                          );
                        }}
                      />
                    </Table>
                  </Col>
                  <Col span={24}>
                    <Row gutter={16}>
                      {promotionDetails.map((item, index) => {
                        return (
                          <Col
                            key={item.id}
                            span={6}
                            style={{ marginBottom: "10px" }}
                            onClick={() =>
                              router.push(
                                `/admin?carSlotId=${carSlot.carSlotCode}`
                              )
                            }
                          >
                            <Card
                              headStyle={{
                                backgroundColor: "#8CB3F1",
                                color: "white",
                                height: "20px",
                                textAlign: "center",
                                fontSize: "13px",
                              }}
                              style={{
                                margin: "10px",
                                borderRadius: "20px",
                                overflow: "hidden",
                                cursor: "pointer",
                                height: "150px",
                                alignContent: "center",
                              }}
                              hoverable
                              title={item.description}
                              bordered={false}
                            >
                              <div>
                                <Image
                                  src={promotion_gif}
                                  width={120}
                                  height={120}
                                />
                              </div>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateBill;
