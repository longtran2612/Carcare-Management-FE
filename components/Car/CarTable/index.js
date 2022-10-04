import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { ClearOutlined } from "@ant-design/icons";
import { getCar } from "pages/api/carAPI";
import { SearchOutlined } from "@ant-design/icons";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddCar from "components/Modal/ModalAddCar";
import { useRouter } from "next/router";
import CarDetail from "../CarDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
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
      dataIndex: "id",
      key: "id",
      render: (id) => <a>{id}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.color).toLowerCase().includes(value.toLowerCase()) ||
          String(record.licensePlate)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.carModel.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.user.name).toLowerCase().includes(value.toLowerCase())
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mẫu xe",
      dataIndex: "carModel",
      key: "carModel",
      render: (carModel) => {
        return <div>{carModel.name}</div>;
      },
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
      ...getColumnSearchProps("licensePlate"),
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
    },
    {
      title: "Sở hữu",
      dataIndex: "user",
      key: "user",
      render: (user) => {
        return <div>{user.name}</div>;
      },
    },
  ];

  const handleGetCar = async () => {
    setLoading(true);
    try {
      const res = await getCar();
      setCars(res.data.Data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  // const handleRemoveService = async () => {
  //   try {
  //     const res = await removeServiceApi(id);
  //     if (res.data.StatusCode == 200) {
  //       handleGetServices();
  //       setModalQuestion(false);
  //       setId(null);
  //     }
  //   } catch (error) {}
  // };

  useEffect(() => {
    handleGetCar();
  }, []);

  const handleSuccessCreateCar = (data) => {
    handleGetCar();
  };

  return (
    <>
      {carId ? (
        <CarDetail carId={carId} onUpdateCar={handleGetCar} />
      ) : (
        <div>
          <Button type="primary" onClick={() => setModalCar(true)}>
            Thêm Xe
          </Button>
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
              <Button
                onClick={() => setSearchGlobal("")}
                icon={<ClearOutlined />}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
          <Table
            onChange={handleSearch}
            columns={columns}
            dataSource={cars}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?carId=${record.id}`);
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
      {/* <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      /> */}
      <Loading loading={loading} />
    </>
  );
}

export default CarTable;
