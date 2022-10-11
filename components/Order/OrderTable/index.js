import { Table, Tag, Space, Button, Row, Col, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { getPriceHeaders } from "pages/api/priceHeaderAPI";
import ModalQuestion from "components/Modal/ModalQuestion";
import { useRouter } from "next/router";
import moment from "moment";
const formatDate = "DD/MM/YYYY";
import Loading from "components/Loading";
import {
  ClearOutlined,
  SearchOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { COOKIE_NAME_PRERENDER_BYPASS } from "next/dist/server/api-utils";

function OrderTable({}) {
  // const [priceHeaders, setPriceHeaders] = useState([]);
  // const [modalPriceHeader, setModalPriceHeader] = useState(false);
  // const [id, setId] = useState(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  // const { priceHeaderId } = router.query;
  const [loading, setLoading] = useState(false);

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
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (id) => <a style={{ color: "blue" }}>{id}</a>,
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Xe",
      dataIndex: "car",
      key: "car",
    },
    {
      title: "Nhân viên sử lý",
      dataIndex: "employee",
      key: "employee",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "toDate",
      key: "toDate",
      render: (text, record, dataIndex) => {
        return <div>{moment(record.toDate).format(formatDate)}</div>;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
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

  // const handleGetPriceHeaders = async () => {
  //   setLoading(true);
  //   try {
  //     getPriceHeaders().then((res) => {
  //       if (res.data.StatusCode == 200) {
  //         setPriceHeaders(res.data.Data);
  //       } else {
  //         message.error(res.data.message);
  //       }
  //       setLoading(false);
  //     });
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err);
  //   }
  // };
  // // const handleRemoveService = async () => {
  // //   try {
  // //     const res = await removeServiceApi(id);
  // //     if (res.data.StatusCode == 200) {
  // //       handleGetServices();
  // //       setModalQuestion(false);
  // //       setId(null);
  // //     }
  // //   } catch (error) {}
  // // };

  // useEffect(() => {
  //   handleGetPriceHeaders();
  // }, []);

  // const handleSuccessCreatePriceHeader = (data) => {
  //   let newArr = [...priceHeaders];
  //   newArr.push(data);
  //   setPriceHeaders(newArr);
  // };

  return (
    <>
      {/* {priceHeaderId ? (
        <PriceHeaderDetail
          priceHeaderId={priceHeaderId}
          onUpdatePriceHeaders={handleGetPriceHeaders}
        />
      ) : ( */}
      <div>
          <Table
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
                      onClick={() => setModalPrice(true)}
                    >
                      {" "}
                      Thêm mới yêu cầu
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            bordered
            // dataSource={priceHeaders}
            pagination={{
              pageSize: 20,
            }}
            scroll={{
              y: 450,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {record.description}
                </p>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  router.push(`/admin?orderId=${record.id}`);
                },
              };
            }}
          />
      
      </div>
      {/* <ModalAddPriceHeader
            show={modalPriceHeader}
            handleCancel={() => setModalPriceHeader(false)}
            onSuccess={(data) => handleSuccessCreatePriceHeader(data)}
          />
      
      )} */}
      <Loading loading={loading} />
    </>
  );
}

export default OrderTable;
