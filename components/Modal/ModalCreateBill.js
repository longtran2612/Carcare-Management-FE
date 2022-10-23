import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Select,
  Typography,
  Card,
  Table,
  Drawer,
  Divider,
  Button,
  Avatar,
  Tag,
  List,
} from "antd";
import { getPromotionDetail } from "pages/api/promotionDetail";
import { createBill } from "pages/api/billAPI";
import { getCarbyCustomerId } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import { openNotification } from "utils/notification";
import { formatMoney } from "utils/format";
import moment from "moment";
import Image from "next/image";
import { TagsOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import logo from "public/images/logo-footer-customer.png";

const { Title } = Typography;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
const formatDate = "HH:mm DD/MM/YYYY";

const ModalCreateBill = ({ order, show, onSuccess, handleCancel }) => {
  const [form] = Form.useForm();

  const [promotionDetails, setPromotionDetails] = useState([]);
  const [promotionSelected, setPromotionSelected] = useState(null);
  const [showSelectPromotion, setShowSelectPromotion] = useState(false)
  const [showPrint, setShowPrint] = useState(false)

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

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
  const totalPromotionAmount = () => {
    if (promotionSelected) {
      if (promotionSelected?.type === "PERCENTAGE") {
        let total = (totalPriceService() * promotionSelected?.amount) / 100;
        if (total > promotionSelected?.maximumDiscount) {
          return promotionSelected?.maximumDiscount;
        }
        return total;
      } else {
        if (promotionSelected?.type === "MONEY") {
          return promotionSelected.amount;
        }
      }
    }
  };
  const finalTotalPrice = () => {
    if (
      promotionSelected?.type === "PERCENTAGE" ||
      promotionSelected?.type === "MONEY"
    ) {
      return totalPriceService() - totalPromotionAmount();
    }
    return totalPriceService();
  };

  const handleType = (value) => {
    switch (value) {
      case "MONEY":
        return <Tag color="blue">Giảm tiền</Tag>;
      case "PERCENTAGE":
        return <Tag color="green">Giảm theo %</Tag>;
      case "GIFT":
        return <Tag color="gold">Tặng quà</Tag>;
      default:
    }
  };

  const onFinish = async (values) => {
    const dataCreateBill = {
      orderId: order.id,
      // promotionCodes: [promotionSelected?.promotionDetailCode],
      // totalPromotionAmount: totalPromotionAmount(),
      paymentAmount: finalTotalPrice(),
      paymentType: values.paymentType,
      cardNumber: "",
    };
    if(promotionSelected !=undefined){
      dataCreateBill.promotionCodes = [promotionSelected?.promotionDetailCode];
      dataCreateBill.totalPromotionAmount = totalPromotionAmount();
    }
    console.log(dataCreateBill);
    try {
      const res = await createBill(dataCreateBill);
      openNotification("Thành công!", "Tạo hóa đơn thành công!");
      handleCancel();
      onSuccess(res.data);
      setShowPrint(true);
      handlePrint();
      setShowPrint(false)
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
                <Divider>
                  <Title level={4}>Thông tin hóa đơn</Title>
                </Divider>
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
                              <Table.Summary.Cell index={2}>
                                Tổng tiền dịch vụ
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3}>
                                {formatMoney(totalPriceService() || 0)}
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0}>
                                <Button
                                  icon={<TagsOutlined />}
                                  type="ghost"
                                  style={{
                                    backgroundColor: "yellow",
                                    color: "black",
                                  }}
                                  onClick={() => setShowSelectPromotion(true)}
                                >
                                  Khuyến mãi
                                </Button>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={1}>
                                {promotionSelected?.description}{" "}
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                {handleType(promotionSelected?.type)}
                              </Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                <span style={{ color: "yellow" }}>
                                  - {formatMoney(totalPromotionAmount() || 0)}
                                </span>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell
                                index={1}
                              ></Table.Summary.Cell>
                              <Table.Summary.Cell index={2}>
                                Tổng
                              </Table.Summary.Cell>

                              <Table.Summary.Cell index={3}>
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {formatMoney(finalTotalPrice() || 0)}
                                </span>
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
                        width={170}
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
                  <Col span={6}>
                    <Form.Item
                      label="Hình thức thanh toán"
                      name="paymentType"
                      rules={[{ required: true }]}
                    >
                      <Select defaultValue="CASH">
                        <Option value="CASH">Tiền mặt</Option>
                        <Option value="DEBIT">Thẻ</Option>
                      </Select>
                      {/* <Switch >
                        <Route path="/cash" component={Cash} />
                        <Route path="/debit" component={Debit} />
                        </Switch> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Drawer
        title="Chọn khuyến mãi"
        placement="right"
        onClose={() => setShowSelectPromotion(false)}
        visible={showSelectPromotion}
        width={700}
      >
        <>
          <List
            dataSource={promotionDetails}
            itemLayout="vertical"
            size="large"
            renderItem={(item) => (
              <Row gutter={16}>
                <Col
                  style={{
                    border: "solid gray 1px",
                    borderRadius: "5px",
                    margin: "10px",
                  }}
                  span={24}
                >
                  <List.Item
                    key={item.id}
                    onClick={() => {
                      if (totalPriceService() > item.minimumSpend) {
                        setPromotionSelected(item);
                        setShowSelectPromotion(false);
                      } else {
                        openNotification(
                          "Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã khuyến mãi này"
                        );
                      }
                    }}
                    // actions={[
                    //   <Button
                    //     type="primary"
                    //     onClick={() => {
                    //       setPromotionSelected(item);
                    //       setShowSelectPromotion(false);
                    //     }}
                    //   >
                    //     Áp dụng
                    //   </Button>,
                    // ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={{
                            xs: 24,
                            sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                          }}
                          icon={<TagsOutlined />}
                        />
                      }
                      title={<a>{item.name}</a>}
                      description={<Title level={5}>{item.description}</Title>}
                    />
                    <Row>
                      {item.type === "PERCENTAGE" ? (
                        <Col span={24}>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>
                            Giảm {item.amount}%{" "}
                          </span>
                        </Col>
                      ) : (
                        <Col span={24}>
                          <span style={{ fontWeight: "bold" }}>
                            Giảm {formatMoney(item.amount || 0)}{" "}
                          </span>
                        </Col>
                      )}

                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>
                          Số tiền đơn hàng tối thiểu:{" "}
                        </span>
                        {formatMoney(item.minimumSpend || 0)}
                      </Col>
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>
                          Giảm tối đa:{" "}
                        </span>
                        {formatMoney(item.maximumDiscount || 0)}
                      </Col>
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>
                          Ngày bắt đầu:{" "}
                        </span>
                        {moment(item.fromDate).format("DD/MM/YYYY")}
                      </Col>
                      <Col span={12}>
                        <span style={{ fontWeight: "bold" }}>Kết thúc: </span>
                        {moment(item.toDate).format("DD/MM/YYYY")}
                      </Col>
                    </Row>
                  </List.Item>
                </Col>
              </Row>
            )}
          />
        </>
      </Drawer>
      {
        showPrint && <div ref={componentRef}>
        <br />
        <div className="invoice-box">
          <table>
            <tr className="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td className="title">
                      <Image
                        src={logo}
                        width={150}
                        height={100}
                        alt="Company logo"
                      />
                    </td>
                    <td>
                      Order #: {order?.orderCode}
                      <br />
                      Ngày tạo:{" "}
                      {moment(order?.createDate).format("HH:ss DD/MM/YYYY")}
                      <br />
                      Ngày thanh toán: {moment().format("HH:ss DD/MM/YYYY")}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      VLCareCare
                      <br />
                      0772555445
                      <br />
                      12 Nguyễn Văn bảo
                      <br />
                      Phường 5,Gò Vấp, Hồ Chí Minh
                    </td>

                    <td>
                      Khách hàng : {order?.customerName}
                      <br />
                      Số điện thoại : {order?.customerPhoneNumber}
                      <br />
                      Xe : {order?.carName} - {order?.carLicensePlate}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr className="heading">
              <td>Thanh Toán</td>

              <td>
                {form.getFieldValue("paymentType") == "CASH"
                  ? "Tiền mặt"
                  : "Chuyển khoản"}
              </td>
            </tr>
            <tr className="heading">
              <td>Dịch vụ</td>

              <td>Thành tiền</td>
            </tr>

            {order?.services?.map((item) => (
              <>
                <tr className="item">
                  <td>{item?.name}</td>

                  <td>{formatMoney(item?.servicePrice?.price)}</td>
                </tr>
              </>
            ))}
            {promotionSelected && (
              <>
                <tr className="item">
                  <td>Khuyến mãi</td>
                  <td><a style={{color:'red'}}>-{formatMoney(totalPromotionAmount() || 0)}</a></td>
                </tr>
              </>
            )}

            <tr className="total">
              <td></td>

              <td>Tổng: {formatMoney(finalTotalPrice() || 0)}</td>
            </tr>
          </table>
          <Divider style={{paddingTop:'50px'}}>
            {" "}
          
              Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi
           
          </Divider>
        </div>
      </div>
      }
    </>
  );
};

export default ModalCreateBill;
