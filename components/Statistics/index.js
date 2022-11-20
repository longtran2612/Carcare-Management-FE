import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Breadcrumb, Col, Row, Select, Form, Button, Typography, Input } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import { getStatistic } from "pages/api/statisticAPI";
import { ClearOutlined } from "@ant-design/icons";
import moment from "moment";
import { formatMoney } from "utils/format";
import { getCustomers } from "pages/api/customerAPI";
import { getUsers } from "pages/api/userAPI";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const StatisticalPage = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataStatistic, setDataStatistic] = useState([]);
  const [status, setStatus] = useState(100);

  const handleFetchCustomer = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchUser = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchData = async () => {
    let body = {
      fromDate: moment(moment().subtract(7, "days")),
      toDate: moment(),
    };
    try {
      const res = await getStatistic(body);
      setDataStatistic(res.data.Data);
      console.log(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchData2 = async (values) => {
    console.log(values);
    let body = {
      fromDate: moment(values.rangerDate[0]),
      toDate: moment(values.rangerDate[1]),
      userId: values.user,
    };
    try {
      console.log(body);
      const res = await getStatistic(body);
      setDataStatistic(res.data.Data);
      console.log(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchCustomer();
    handleFetchUser();
    handleFetchData();
  }, []);

  const config = {
    data: dataStatistic,
    xField: "date",
    yField: "value",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },

    title: {
      position: "center",
      text: "Biểu đồ thống kê doanh thu",
    },
    meta: {
      date: {
        alias: "Tháng",
      },
      value: {
        alias: "Doanh số",
        formatter: (v) => {
          return formatMoney(v);
        },
      },
    },
  };

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href=""> Thống kê</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} autoComplete="off">
        <Row style={{ padding: "0 5rem 0 5rem" }} gutter={[16]}>
          <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Thống kê doanh số
            </Typography.Title>
          </Col>
          <Col span={13}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="rangerDate"
              initialValue={[moment(moment().subtract(7, "days")), moment()]}
            >
              <RangePicker format={dateFormat} />;
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="user">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Nhân viên"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {users.map((item) => (
                  <Option value={item.id}>
                    {item?.name + " - " + item?.phone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={1}>
            <Button
              icon={<ClearOutlined />}
              style={{ width: "100%" }}
              onClick={() => {
                form.setFieldsValue({
                  rangerDate: [moment(moment().subtract(7, "days")), moment()],
                  user: undefined,
                });
              }}
              type="dashed"
            ></Button>
          </Col>
          <Col span={3}>
            <Button
              style={{ width: "100%" }}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleFetchData2(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              type="primary"
            >
              Thống kê
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Column {...config} />;
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default StatisticalPage;
