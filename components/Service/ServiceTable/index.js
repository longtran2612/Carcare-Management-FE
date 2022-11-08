import { Table, Tag, Button, Input, Row, Col, Space, Select } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { getServices, searchService } from "pages/api/serviceAPI";
import { getCategories } from "pages/api/categoryAPI";
import ModalAddService from "components/Modal/ModalAddService";
import { useRouter } from "next/router";
import ServiceDetail from "../ServiceDetail";
import Loading from "components/Loading";
import Highlighter from "react-highlight-words";
import { formatMoney } from "utils/format";

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
      const response = await getServices();
      setServices(response.data.Data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchCategoryServices = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategoryServices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetServices();
  }, [serviceId]);

  useEffect(() => {
    fetchCategoryServices();
  }, []);

  const handleSuccessCreateService = (data) => {
    handleGetServices();
    fetchCategoryServices();
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
    {
      title: "Loại dịch vụ",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
      render: (text,record) => {
        return (
        handleTypeService(record.type)
        )
      },
    },
    {
      title: "Trạng thái",
      key: "statusName",
      dataIndex: "statusName",
      ...getColumnSearchProps("statusName"),
      filters: [
        {
          value: "Đang có hiệu lực",
          text: "Đang có hiệu lực",
        },
        {
          value: "Không có hiệu lực",
          text: "Không có hiệu lực",
        },
      ],
      filteredValue: filteredInfo.statusName || null,
      onFilter: (value, record) => record.statusName.includes(value),
      ellipsis: true,
      render: (statusName) => {
        return (
          <>
            {statusName === "Đang có hiệu lực" ? (
              <Tag color={"green"}>{"Đang có hiệu lực"}</Tag>
            ) : (
              <Tag color={"red"}>{"Không có hiệu lực"}</Tag>
            )}
          </>
        );
      },
    },
  ];

  const handleTypeService = (value) => {
    switch (value) {
      case "NORMAL":
        return <Tag color={"blue"}>{"Thông thường"}</Tag>;
      case "NEW":
        return  <Tag color={"green"}>{"Mới"}</Tag>;
      case "LIKE":
        return  <Tag color={"pink"}>{"Yêu thích"}</Tag>;
        default:
          break;
    }
  };

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
              <Button
                style={{ float: "right" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalService(true)}
              >
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
