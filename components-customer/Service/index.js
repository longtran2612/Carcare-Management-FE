import React, { useEffect, useState } from "react";
import { getAllBillsByCustomerId } from "pages/api/billAPI";
import { getOrders } from "pages/api/orderAPI";
import Loading from "components/Loading";
import {
  Avatar,
  List,
  Space,
  Drawer,
  Col,
  Row,
  Typography,
  Divider,
} from "antd";
import { formatMoney } from "utils/format";
import moment from "moment";
import Image from "next/image";
import Cookies from "js-cookie";
import payment_completed from "public/images/payment_complete.gif";

const { Title } = Typography;
const formatDate = "HH:ss DD/MM/YYYY";

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p
      style={{ font: "bold" }}
      className="site-description-item-profile-p-label"
    >
      {title}:
    </p>
    {content}
  </div>
);
const ServiceCustomer = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [billDetail, setBillDetail] = useState({});
  

  const handleGetOrders = async () => {
    setLoading(true);
    const username = Cookies.get("username");
    let dataGetOrder = {
      keyword: "0395071370",
      pageSize: 20,
      pageNumber: 0,
      status: 2,
      sort: [
        {
          key: "createDate",
          asc: true,
        },
      ],
    };
    try {
      const res = await getOrders(dataGetOrder);
      console.log(res.data.Data);
      setOrders(res.data.Data.content);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const totalPriceService = () => {
    return billDetail?.services?.reduce((total, cur) => {
      return (total += cur?.servicePrice?.price);
    }, 0);
  };
  const totalTimeService = () => {
    return billDetail?.services?.reduce((total, cur) => {
      return (total += cur?.estimateTime);
    }, 0);
  };
  const handleType = (value) => {
    switch (value) {
      case "MONEY":
        return "Giảm tiền";
      case "PERCENTAGE":
        return "Giảm theo";
      case "GIFT":
        return "Tặng quà";
      default:
    }
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={orders}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            onClick={() => {
              setBillDetail(item);
              setShowDetail(true);
            }}
            extra={<Image width={170} height={170} src={payment_completed} />}
          >
            <List.Item.Meta
              title={
                <Typography.Title level={5}>{item.billCode}</Typography.Title>
              }
              description={
                <>
                  <Row gutter={16}>
                    <Col span={8}>
                      <DescriptionItem title="Mã xe" content={item.carCode} />
                    </Col>
                    <Col span={8}>
                      <DescriptionItem title="Biển số" content={item.carName} />
                    </Col>
                    <Col span={8}>
                      <DescriptionItem
                        title="Tên xe"
                        content={item.carLicensePlate}
                      />
                    </Col>
                  </Row>
                </>
              }
            />
            <Row gutter={16}>
              <Col span={8}>
                <DescriptionItem
                  title="Tổng tiền dịch vụ"
                  content={formatMoney(item.totalServicePrice)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Khuyến mãi"
                  content={formatMoney(item.totalPromotionAmount)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Thanh toán"
                  content={formatMoney(item.paymentAmount)}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <DescriptionItem
                  title="Ngày thanh toán"
                  content={moment(item.totalServicePrice).format(formatDate)}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Hình thức thanh toán"
                  content={item.paymentType === "CASH" ? "Tiền mặt" : "Thẻ"}
                />
              </Col>
              <Col span={8}>
                <DescriptionItem
                  title="Tình trạng thanh toán"
                  content={item.statusName}
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width={900}
      >
        <Divider>
          <Title level={5}>Hóa đơn mã: {billDetail.billCode}</Title>
        </Divider>
        <p className="site-description-item-profile-p">Xe</p>
        <Row>
          <Col span={8}>
            <DescriptionItem title="Mã xe" content={billDetail.carCode} />
          </Col>
          <Col span={8}>
            <DescriptionItem title="Tên xe" content={billDetail.carName} />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Biển số"
              content={billDetail.carLicensePlate}
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Dịch vụ sử dụng</p>
        <Row>
          {billDetail?.services?.map((item, index) => (
            <>
              <Col span={6}>
                <DescriptionItem
                  title="Mã dịch vụ"
                  content={item?.serviceCode}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem title="Tên dịch vụ" content={item?.name} />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Thời gian sử lý"
                  content={item?.estimateTime + " phút"}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Giá"
                  content={formatMoney(item?.servicePrice?.price)}
                />
              </Col>
            </>
          ))}
        </Row>
        {billDetail?.promotionDetails?.map((item, index) => (
          <>
            <Divider />
            <p className="site-description-item-profile-p">
              Khuyến mãi sử dụng
            </p>
            <Row>
              <Col span={6}>
                <DescriptionItem
                  title="Mã khuyến mãi sử dụng"
                  content={item?.promotionDetailCode}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem title="Mô tả" content={item?.description} />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Loại khuyến mãi"
                  content={handleType(item?.type)}
                />
              </Col>
              <Col span={6}>
                <DescriptionItem
                  title="Tiền giảm"
                  content={formatMoney(billDetail?.totalPromotionAmount)}
                />
              </Col>
            </Row>
          </>
        ))}

        <Divider />
        <p className="site-description-item-profile-p">Thông tin thanh toán</p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Tổng Thời gian sử lý"
              content={totalTimeService() + " phút"}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Tổng tiền khách trả"
              content={formatMoney(
                totalPriceService() - (billDetail?.totalPromotionAmount || 0) ||
                  0
              )}
            />
          </Col>

          <Col span={12}>
            <DescriptionItem
              title="Hình thức thanh toán"
              content={billDetail.paymentType === "CASH" ? "Tiền mặt" : "Thẻ"}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Ngày thanh toán"
              content={moment(billDetail.paymentDate).format(formatDate)}
            />
          </Col>
        </Row>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
};

export default ServiceCustomer;
