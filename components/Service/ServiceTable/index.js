import { Table, Tag, Button, Input, Row, Col, Space, Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import {
  fetchCategoryServiceApi,
  getServices,
  removeServiceApi,
  searchService,
} from "pages/api/serviceAPI";
import ModalAddService from "components/Modal/ModalAddService";
import { useRouter } from "next/router";
import ServiceDetail from "../ServiceDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";

function ServiceTable({}) {
  const [services, setServices] = useState([]);
  const [modalService, setModalService] = useState(false);
  const [id, setId] = useState(null);
  const router = useRouter();
  const { serviceId } = router.query;
  const { Option } = Select;
  const [searchValue, setSearchValue] = useState({
    category_id: null,
  });
  const [categoryServices, setCategoryServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // search
  const [searchText, setSearchText] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  const handleGetServices = async () => {
    setLoading(true);
    try {
      const response = await searchService();
      setServices(response.data.Data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchCategoryServices = async () => {
    setLoading(true);
    try {
      const response = await fetchCategoryServiceApi();
      setCategoryServices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetServices();
    fetchCategoryServices();
  }, []);

  const handleSuccessCreateService = (data) => {
    let newArr = [...services];
    newArr.push(data);
    setServices(newArr);
  };

  const handleSearchService = async () => {
    setLoading(true);
    try {
      const response = await searchService(searchValue);
      console.log(response);
      setServices(response.data.Data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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
      dataIndex: "id",
      key: "id",
      render: (id) => <a style={{ color: "blue" }}>{id}</a>,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 2,
      },
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.price?.price)
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
      title: "Danh mục dịch vụ",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
      render: (category) => {
        return (
          <>
            {category === null ? (
              <Tag color={"red"}>{"Chưa có danh mục"}</Tag>
            ) : (
              <div>{category.name}</div>
            )}
          </>
        );
      },
    },

    {
      title: "Loại dịch vụ",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        return (
          <>
            {price === null ? (
              <Tag color={"red"}>{"Chưa có giá"}</Tag>
            ) : (
              <div>{price.price}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          value: "ACTIVE",
          text: "Hoạt động",
        },
        {
          value: "INACTIVE",
          text: "Không hoạt động",
        },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      ellipsis: true,
      render: (status) => {
        return (
          <>
            {status === "ACTIVE" ? (
              <Tag color={"green"}>{"Hoạt động"}</Tag>
            ) : (
              <Tag color={"red"}>{"Không hoạt động"}</Tag>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      {serviceId ? (
        <ServiceDetail
          serviceId={serviceId}
          onUpdateService={handleGetServices}
        />
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
              <Button
                onClick={() => setSearchGlobal("")}
                icon={<ClearOutlined />}
              >
                Xóa bộ lọc
              </Button>
            </Col>
            <Col span={11}>
              <Button style={{float:"right"}} type="primary" onClick={() => setModalService(true)}>
                Thêm dịch vụ
              </Button>
            </Col>
          </Row>
          <Table
            onChange={handleSearch}
            columns={columns}
            dataSource={services}
            bordered
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 450,
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?serviceId=${record.id}`);
                },
              };
            }}
          />
        </div>
      )}
      <ModalAddService
        show={modalService}
        handleCancel={() => setModalService(false)}
        onSuccess={(data) => handleSuccessCreateService(data)}
      />
      <Loading loading={loading} />
    </>
  );
}

export default ServiceTable;
