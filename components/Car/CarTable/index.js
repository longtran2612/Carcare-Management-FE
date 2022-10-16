import { Table, Tag, Space, Button, Row, Col, Input, Tooltip } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { ClearOutlined } from "@ant-design/icons";
import { getCars } from "pages/api/carAPI";
import { SearchOutlined } from "@ant-design/icons";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCar from "components/Modal/ModalAddCar";
import { useRouter } from "next/router";
import CarDetail from "../CarDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import { openNotification } from "utils/notification";

function CarTable({}) {
  const [cars, setCars] = useState([]);
  const [modalCar, setModalCar] = useState(false);
  const [id, setId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { carId } = router.query;

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
      title: "MÃ",
      dataIndex: "carCode",
      key: "carCode",
      render: (carCode) => <a style={{ color: "blue" }}>{carCode}</a>,
      filteredValue: [searchGlobal],
      sorter: {
        compare: (a, b) => a.carCode - b.carCode,
        multiple: 2,
      },
      onFilter: (value, record) => {
        return (
          String(record.carCode).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.color).toLowerCase().includes(value.toLowerCase()) ||
          String(record.brand).toLowerCase().includes(value.toLowerCase()) ||
          String(record.model).toLowerCase().includes(value.toLowerCase()) ||
          String(record.licensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.customerName)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },

    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
      ...getColumnSearchProps("licensePlate"),
    },
    {
      title: "Sở hữu",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      ...getColumnSearchProps("model"),
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
    },
    {
      title: "Động cơ",
      dataIndex: "engine",
      key: "engine",
      ...getColumnSearchProps("engine"),
    },
    {
      title: "Truyền động",
      dataIndex: "transmission",
      key: "transmission",
      ...getColumnSearchProps("transmission"),
    },
    {
      title: "Chỗ ngồi",
      dataIndex: "seats",
      key: "seats",
      ...getColumnSearchProps("seats"),
    },
    {
      title: "Nhiên liệu",
      dataIndex: "fuel",
      key: "fuel",
      ...getColumnSearchProps("fuel"),
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
    },
  ];

  const handleGetCar = async () => {
    setLoading(true);
    try {
      const res = await getCars();
      setCars(res.data.Data);
      setLoading(false);
    } catch (err) {
      openNotification(err.response.data.message[0]);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCar();
  }, []);

  const handleSuccessCreateCar = () => {
    handleGetCar();
  };

  return (
    <>
      {carId ? (
        <CarDetail carId={carId} onUpdateCar={handleGetCar} />
      ) : (
        <div>
          <Row style={{ margin: "20px 0px" }}>
            <Col span={8} style={{ marginRight: "10px" }}>
              <Input.Search
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchGlobal(e.target.value)}
                onSearch={(value) => setSearchGlobal(value)}
                value={searchGlobal}
              />
            </Col>
            <Col span={4}>
              <Button onClick={() => handleReset()} icon={<ClearOutlined />}>
                Xóa bộ lọc
              </Button>
            </Col>
            <Col span={11}>
              <Button
                style={{ float: "right" }}
                type="primary"
                onClick={() => setModalCar(true)}
              >
                Thêm Xe
              </Button>
            </Col>
          </Row>
          <Table
            onChange={handleSearch}
            bordered
            columns={columns}
            dataSource={cars}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 450,
              x: 2000,
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?carId=${record.carCode}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddCar
        show={modalCar}
        handleCancel={() => setModalCar(false)}
        onSuccess={(data) => handleSuccessCreateCar(data)}
      />
      <Loading loading={loading} />
    </>
  );
}

export default CarTable;
