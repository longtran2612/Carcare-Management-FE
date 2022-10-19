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
  Popconfirm,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getOrders, cancelOrder } from "pages/api/orderAPI";
import moment from "moment";
const formatDate = "HH:mm:ss DD/MM/YYYY ";
import { openNotification } from "utils/notification";

import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalAddOrder from "components/Modal/ModalAddOrder";
import { OrderDetail } from "components/Order/OrderDetail";
import ModalSelectSlot from "components/Modal/ModalSelectSlot";
const { Title } = Typography;

function OrderTable({}) {
  const [orders, setOrders] = useState([]);
  const [modalOrder, setModalOrder] = useState(false);
  const [modalSelectSlot, setModalSelectSlot] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const { orderRequestId } = router.query;
  const [loading, setLoading] = useState(false);
  const [orderSelected, setOrderSelected] = useState(null);

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

  const handleSuccessCreateOrder = async () => {
    handleGetorders();
  };

  const handleCancelOrder = async (id) => {
    setLoading(true);
    try {
      const res = await cancelOrder(id);
      openNotification("Thành công", "Hủy đơn hàng thành công");
      handleGetorders();
    } catch (err) {
      openNotification("Thất bại", "Hủy đơn hàng thất bại");
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
      dataIndex: "orderCode",
      key: "orderCode",
      width: 130,
      render: (orderCode) => <a style={{ color: "blue" }}>{orderCode}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.orderCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
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
      title: "Biên số",
      dataIndex: "carLicensePlate",
      key: "carLicensePlate",
      ...getColumnSearchProps("statusName"),
    },
    {
      title: "Thời gian xử lý",
      dataIndex: "totalEstimateTime",
      key: "totalEstimateTime",
      render: (totalEstimateTime) => {
        return (
          <div>
            {totalEstimateTime ? `${totalEstimateTime} phút` : "Chưa có"}
          </div>
        );
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createDate",
      key: "createDate",
      render: (text, record, dataIndex) => {
        return <div>{moment(record.createDate).format(formatDate)}</div>;
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
            <Tag color="blue">{record.statusName}</Tag>
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
                handleCancelOrder(record.id);
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
                setOrderSelected(record.id);
                setModalSelectSlot(true);
              }}
            >
              <Button type="primary">Xử lý</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleGetorders = async () => {
    setLoading(true);
    let dataGetOrder = {
      keyword: "",
      pageSize: 20,
      pageNumber: 0,
      sort: [
        {
          key: "createDate",
          asc: true,
        },
      ],
    };
    try {
      const res = await getOrders(dataGetOrder);
      setOrders(res.data.Data.content);
      setLoading(false);
    } catch (error) {
      openNotification(error.response.data.message[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetorders();
  }, []);

  const columnService = [
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
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian xử lí",
      dataIndex: "estimateTime",
      key: "estimateTime",
      render: (text, record, dataIndex) => {
        return <div>{record.estimateTime} phút</div>;
      },
    },
    {
      title: "Giá",
      dataIndex: "servicePrice",
      key: "servicePrice",
      render: (servicePrice) => {
        return (
          <>
            {servicePrice === null ? (
              <Tag color={"red"}>{"Chưa có giá"}</Tag>
            ) : (
              <div>{formatMoney(servicePrice.price)}</div>
            )}
          </>
        );
      },
    },
  ];

  const handkeSuccessSelectSlot = async () => {
    handleGetorders();
  };

  return (
    <>
      {orderRequestId ? (
        <OrderDetail
          orderRequestId={orderRequestId}
          onUpdateOrders={handleGetorders}
        />
      ) : (
        <div>
          <Table
            rowKey="id"
            bordered
            title={() => (
              <>
                <Row>
                  <Col span={8} style={{ marginRight: "10px" }}>
                    <Input.Search
                      placeholder="Tìm kiếm khách hàng/xe/dịch vụ"
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
                  <Col span={11}>
                    <Button
                      style={{ float: "right" }}
                      type="primary"
                      onClick={() => setModalOrder(true)}
                    >
                      {" "}
                      Thêm mới yêu cầu
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={orders}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 450,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <Row style={{ backgroundColor: "#AEAEAE" }} gutter={4}>
                  <Col style={{ padding: "5px" }} span={12}>
                    <Table
                      size="small"
                      bordered
                      title={() => "Dịch vụ"}
                      dataSource={record.services}
                      columns={columnService}
                      pagination={false}
                    ></Table>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "5px",
                        borderRadius: "3px",
                        margin: "5px",
                      }}
                    >
                      <Row gutter={32}>
                        <Col
                          style={{ borderRight: "solid LightGray 1px" }}
                          span={11}
                        >
                          <Divider> Thông tin khách hàng</Divider>
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>
                              Tên: {record?.customerName}
                            </Timeline.Item>
                            <Timeline.Item>
                              Số điện thoại: {record?.customerPhoneNumber}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                        <Col span={12}>
                          <Divider> Thông tin xe</Divider>
                          <Timeline style={{ marginTop: "20px" }}>
                            <Timeline.Item>Xe: {record?.carName}</Timeline.Item>
                            <Timeline.Item>
                              Biển số: {record?.carLicensePlate}
                            </Timeline.Item>
                          </Timeline>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            onRow={(record, rowIndex) => {
              return {
                onDoubleClick: (event) => {
                  router.push(`/admin?orderRequestId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddOrder
        show={modalOrder}
        handleCancel={() => setModalOrder(false)}
        onSuccess={(data) => handleSuccessCreateOrder(data)}
      />
      <ModalSelectSlot
        show={modalSelectSlot}
        onSelectOrder={orderSelected}
        handleCancel={() => setModalSelectSlot(false)}
        onSuccess={() => handkeSuccessSelectSlot()}
      />

      <Loading loading={loading} />
    </>
  );
}

export default OrderTable;
