import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Input,
  Typography,
  Divider,
  Drawer,
  Popconfirm,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getBills, cancelBill } from "pages/api/billAPI";
import moment from "moment";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import logo from "public/images/logo-footer-customer.png";
import { async } from "@firebase/util";
const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const BillTable = () => {
  const [bills, setBills] = useState([]);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [billDetail, setBillDetail] = useState({});
  // const [showPrint, setShowPrint] = useState(false)

  const[printBill, setPrintBill] = useState(false)

  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  const handlePrintBill = async (data) => {
    try {
      setBillDetail(data)
      setPrintBill(true);
      handlePrint();
      // setPrintBill(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelBill = async (id) => {
    setLoading(true);
    try {
      const res = await cancelBill(id);
      openNotification("Thành công", "Hủy hóa đơn thành công");
      handleGetbills();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
      width: 120,
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
      width: 120,
      ...getColumnSearchProps("carLicensePlate"),
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      width: 150,
      render: (text, record) => (
        <div>{formatMoney(record.totalServicePrice)}</div>
      ),
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      width: 120,
      ...getColumnSearchProps("paymentType"),
      render: (texr, record) => (
        <div>{record.paymentType == "CASH" ? "Tiền mặt" : "Thẻ"}</div>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: 120,
      render(paymentDate) {
        return <div>{moment(paymentDate).format(formatDate)}</div>;
      },
    },

    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      width: 120,
      ...getColumnSearchProps("statusName"),
      render: (text, record, dataIndex) => {
        return (
          <div>
            <Tag color="green">{record.statusName}</Tag>
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (text, record, dataIndex) => {
        return (
          <>
            <Popconfirm
              title="Xác nhận?"
              placement="topLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              onConfirm={() => {
                handleCancelBill(record.id);
              }}
            >
              <Button
                style={{ marginRight: "5px" }}
                type="primary"
                danger="true"
              >
                Hủy
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Xác nhận?"
              placement="topLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              onConfirm={() => {
                setPrintBill(true);
                handlePrintBill(record);
              }}
            >
              <Button type="primary">Xuất hóa đơn</Button>
            </Popconfirm>
          </>
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
            onDoubleClick: (event) => {
              setBillDetail(record);
              setShowDetail(true);
            },
          };
        }}
      />
      <Drawer
        title="Chi tiết hóa đơn"
        placement="right"
        onClose={() => setShowDetail(false)}
        visible={showDetail}
        width={1000}
        footer={() => (
          <>
            <Divider>VLCARESERvice</Divider>
          </>
        )}
      >
        <Divider>
          <Title level={5}>Hóa đơn mã: {billDetail.billCode}</Title>
        </Divider>

        <p className="site-description-item-profile-p">Khách hàng</p>
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
      {printBill && (
        <div ref={componentRef}>
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
                        Bill #: {billDetail?.billCode}
                        <br />
                        Ngày tạo:{" "}
                        {moment(billDetail?.createDate).format(
                          "HH:ss DD/MM/YYYY"
                        )}
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
                        Khách hàng : {billDetail?.customerName}
                        <br />
                        Số điện thoại : {billDetail?.customerPhoneNumber}
                        <br />
                        Xe : {billDetail?.carName} -{" "}
                        {billDetail?.carLicensePlate}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr className="heading">
                <td>Thanh Toán</td>

                <td>
                  {billDetail?.paymentType == "CASH"
                    ? "Tiền mặt"
                    : "Chuyển khoản"}
                </td>
              </tr>
              <tr className="heading">
                <td>Dịch vụ</td>

                <td>Thành tiền</td>
              </tr>

              {billDetail?.services?.map((item) => (
                <>
                  <tr className="item">
                    <td>{item?.name}</td>

                    <td>{formatMoney(item?.servicePrice?.price)}</td>
                  </tr>
                </>
              ))}
              {billDetail?.totalPromotionAmount && (
                <>
                  <tr className="item">
                    <td>Khuyến mãi</td>
                    <td>
                      <a style={{ color: "red" }}>
                        -{formatMoney(billDetail?.totalPromotionAmount || 0)}
                      </a>
                    </td>
                  </tr>
                </>
              )}

              <tr className="total">
                <td></td>

                <td>Tổng: {formatMoney(billDetail?.paymentAmount || 0)}</td>
              </tr>
            </table>
            <Divider style={{ paddingTop: "50px" }}>
              {" "}
              Cảm ơn quý khách vì đã sử dụng dịch vụ của chúng tôi
            </Divider>
          </div>
        </div>
      )}
      <Loading loading={loading} />
    </>
  );
};

export default BillTable;
