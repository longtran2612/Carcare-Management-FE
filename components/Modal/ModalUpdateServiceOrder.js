import { Table, Tag, Button, Input, Row, Col, Modal, Space } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { getServices } from "pages/api/serviceAPI";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import { formatMoney } from "utils/format";
import { updateOrder } from "pages/api/orderAPI";
import { openNotification } from "utils/notification";

function UpDateServiceOrder({ order, show, onSuccess, handleCancel }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // search
  const [searchText, setSearchText] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleGetServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();
      setServices(response.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetServices();
    if (order) {
      setSelectedRowKeys(order?.services.map((item) => item.id));
      setSelectedRows(order?.services);
    }
  }, [order]);

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
      title: "Mã dịch vụ",
      dataIndex: "serviceCode",
      key: "serviceCode",
      render: (serviceCode) => <a style={{ color: "blue" }}>{serviceCode}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.serviceCode)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.servicePrice?.price)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Thời gian xử lí",
      dataIndex: "estimateTime",
      key: "estimateTime",
      render: (estimateTime) => {
        return <div>{estimateTime} phút</div>;
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
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };
  console.log("rowSelection", rowSelection);
  const totalPriceService = () => {
    return selectedRows.reduce((total, cur) => {
      return (total += cur.servicePrice.price);
    }, 0);
  };
  const totalTimeService = () => {
    return selectedRows.reduce((total, cur) => {
      return (total += cur.estimateTime);
    }, 0);
  };
  const onFinish = async () => {
    setLoading(true);
    let dataUpdate = {
      serviceIds: selectedRowKeys,
    };
    try {
      const res = await updateOrder(order.id, dataUpdate);
      openNotification("Thành công", "cập nhật yêu cầu thành công");
      onSuccess();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
   
  };

  return (
    <>
      <Modal
        title="Danh sách dịch vụ"
        visible={show}
        onCancel={handleCancel}
        width={1200}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        onOk={() => {
          onFinish();
        }}
      >
        <Row style={{ margin: "10px 0px" }}>
          <Col span={8} style={{ marginRight: "10px" }}>
            <Input.Search
              placeholder="Tìm kiếm"
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
        <Table
          rowKey={(record) => record.id}
          onChange={handleSearch}
          columns={columns}
          dataSource={services}
          bordered
          rowSelection={rowSelection}
          pagination={{
            pageSize: 20,
          }}
          scroll={{
            y: 200,
          }}
          size="small"
          footer={() => {
            return (
              <>
                <Row gutter={16}>
                  <Col style={{ marginRight: "10px" }} span={15}></Col>
                  <Col style={{ marginRight: "13px" }} span={4}>
                    {totalTimeService() || 0} phút
                  </Col>
                  <Col span={4}>{formatMoney(totalPriceService() || 0)}</Col>
                </Row>
              </>
            );
          }}
        />
      </Modal>
      <Loading loading={loading} />
    </>
  );
}

export default UpDateServiceOrder;
