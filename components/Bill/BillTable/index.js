import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Timeline,
  Divider,
  Drawer,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getBills } from "pages/api/billAPI";
import moment from "moment";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";

const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

function BillTable({}) {
  const [bills, setBills] = useState([]);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { billId } = router.query;
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [billDetail, setBillDetail] = useState({});

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchGlobal(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = () => {
    setSearchText("");
    setSearchGlobal("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onSearch={(value) => setSearchText(value)}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              handleReset();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: 70,
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Mã",
      dataIndex: "billCode",
      key: "billCode",

      render: (billCode) => <a style={{ color: "blue" }}>{billCode}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.billCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.carLicensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.totalEstimateTime)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.createDate).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("statusName"),
    },
    {
      title: "Biển số xe",
      dataIndex: "carLicensePlate",
      key: "carLicensePlate",
      ...getColumnSearchProps("carLicensePlate"),
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      render: (text, record) => (
        <div>{formatMoney(record.totalServicePrice)}</div>
      ),
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      ...getColumnSearchProps("paymentType"),
      render: (texr, record) => (
        <div>{record.paymentType == "CASH" ? "Tiền mặt" : "Thẻ"}</div>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render(paymentDate) {
        return <div>{moment(paymentDate).format(formatDate)}</div>;
      },
    },

    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      ...getColumnSearchProps("statusName"),
      render: (text, record, dataIndex) => {
        return (
          <div>
            <Tag color="green">{record.statusName}</Tag>
          </div>
        );
      },
    },
  ];

  const handleGetbills = async () => {
    setLoading(true);
    try {
      const res = await getBills();
      if (res.status === 200) {
        setBills(res.data.Data);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Lỗi", "Không thể lấy dữ liệu");
      setLoading(false);
    }
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
    handleGetbills();
  }, []);

  return (
    <>
      <div>
        <Table
          rowKey="id"
          bordered
          title={() => (
            <>
              <Row>
                <Col span={8} style={{ marginRight: "10px" }}>
                  <Input.Search
                    placeholder="Tìm kiếm khách hàng/xe"
                    onChange={(e) => setSearchGlobal(e.target.value)}
                    onSearch={(value) => setSearchGlobal(value)}
                    value={searchGlobal}
                  />
                </Col>
                <Col span={4}>
                  <Button
                    onClick={() => setSearchGlobal("")}
                    icon={<ClearOutlined />}
                  >
                    Xóa bộ lọc
                  </Button>
                </Col>
              
              </Row>
            </>
          )}
          columns={columns}
          dataSource={bills}
          pagination={{
            pageSize: 20,
          }}
          scroll={{
            y: 450,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setBillDetail(record);
                setShowDetail(true);
              },
            };
          }}
        />
      </div>
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width={1000}
        footer={() => (
          <>
            <Divider>VLCARESERvice</Divider>
            ádasds
          </>
        )}
      >
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
          }}
        >
          Hóa đơn mã: {billDetail.billCode}
        </p>
        <p className="site-description-item-profile-p">Personal</p>
        <Row>
          <Col span={8}>
            <DescriptionItem
              title="Mã khách hàng"
              content={billDetail.customerCode}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Tên khách hành"
              content={billDetail.customerName}
            />
          </Col>
          <Col span={8}>
            <DescriptionItem
              title="Số điện thoại"
              content={billDetail.customerPhoneNumber}
            />
          </Col>
        </Row>

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
                  content={item?.estimateTime}
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
          {billDetail?.promotionDetails?.map((item, index) => (
            <>
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
            </>
          ))}
          <Col span={12}></Col>
          <Col span={6}>
            <DescriptionItem
              title="Tổng Thời gian sử lý"
              content={totalTimeService()}
            />
          </Col>
          <Col span={6}>
            <DescriptionItem
              title="Tổng tiền khách trả"
              content={formatMoney(
                totalPriceService() - (billDetail?.totalPromotionAmount || 0) ||
                  0
              )}
            />
          </Col>
        </Row>

        <Divider />
        <p className="site-description-item-profile-p">Thông tin thanh toán</p>
        <Row>
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
}

export default BillTable;
