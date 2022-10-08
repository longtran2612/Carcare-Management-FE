import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Image,
  Space,
  Button,
  Tag,
  Form,
  Select,
  Switch,
  Input,
  DatePicker,
  Table,
} from "antd";
import { useRouter } from "next/router";

import { openNotification } from "utils/notification";
import { getPricesByHeader } from "pages/api/priceAPI";
import {
  getPriceHeaderById,
  updatePriceHeader,
} from "pages/api/PriceHeaderAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import ModalAddPrice from "components/Modal/ModalAddPrice";
import moment from "moment";
import Loading from "components/Loading";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const PriceHeaderDetail = ({ priceHeaderId, onUpdatePriceHeader }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [priceHeaderDetail, setPriceHeaderDetail] = useState({});
  const [prices, setPrices] = useState([]);
  const [modalQuestion, setModalQuestion] = useState(false);
  const [modalPrice, setModalPrice] = useState(false);
  const formatDate = "YYYY/MM/DD";
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
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

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const response = await getPricesByHeader(priceHeaderId);
      console.log(response.data.Data);
      setPrices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      openNotification(error.response.data);
    }
  };

  const fetchPriceHeaderDetail = async () => {
    setLoading(true);
    try {
      const response = await getPriceHeaderById(priceHeaderId);
      setPriceHeaderDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        description: response.data.Data.description,
        fromDate: moment(moment(response.data.Data.fromDate), formatDate),
        toDate: moment(moment(response.data.Data.toDate), formatDate),
        status: response.data.Data.status,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // openNotification(error.response.data);
    }
  };

  useEffect(() => {
    if (priceHeaderId) {
      fetchPriceHeaderDetail();
      fetchPrice();
    }
  }, [priceHeaderId]);

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
      title: "Mã giá",
      dataIndex: "id",
      key: "id",
      filteredValue: [searchGlobal],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.parentId).toLowerCase().includes(value.toLowerCase()) ||
          String(record.price).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Tên giá",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Mã dịch vụ",
      dataIndex: "parentId",
      key: "parentId",
      ...getColumnSearchProps("parentId"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size={8}>
          <Button type="primary">Cập nhật</Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setModalQuestion(true);
              setId(record.id);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values) => {
    try {
      let body = {
        id: priceHeaderDetail.id,
        type: values.type,
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        status: values.status,
      };
      const res = await updatePriceHeader(body, priceHeaderDetail.id);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật dịch vụ thành công!", "");
        onUpdatePriceHeader();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccessCreatePrice = (data) => {
    let newArr = [...prices];
    newArr.push(data);
    setPrices(newArr);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row>
              <Col span={10} style={{ marginRight: "40px" }}>
                <Form.Item
                  label="Tên bảng giá"
                  name="name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="fromDate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker format={formatDate} />
                  {/* <Input /> */}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="toDate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker />
                  {/* <Input /> */}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="status"
                >
                  <Select>
                    <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                    <Select.Option value="INACTIVE">
                      Không hoạt động
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={23}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="PullRight">
              <div
                style={{ bottom: "0", right: "20px", margin: "10px" }}
                className="service-action"
              >
                <div style={{ marginRight: "20px" }}>
                  <Button
                    onClick={() => {
                      fetchPriceHeaderDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          onFinish(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Table
          bordered
            title={() => (
              <>
                <Row>
                  <Col span={8} style={{ marginRight: "10px" }}>
                    <Input.Search
                      placeholder="Tìm kiếm mã/tên/giá dịch vụ"
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
                      Thêm giá
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            columns={columns}
            dataSource={prices}
            pagination={{
              pageSize: 10,
            }}
            scroll={{
              y: 200,
            }}
            rowKey="id"
          />
        </Col>
      </Row>

      <ModalAddPrice
        show={modalPrice}
        handleCancel={() => setModalPrice(false)}
        onSuccess={(data) => handleSuccessCreatePrice(data)}
        priceHeaderId={priceHeaderId}
      />
      <Loading show={loading} />
    </>
  );
};

export default PriceHeaderDetail;
