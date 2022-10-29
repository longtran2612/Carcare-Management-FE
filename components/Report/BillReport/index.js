import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { Breadcrumb, Col, Row, Select } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { getCustomers } from "pages/api/customerAPI";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const BillReport = () => {
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState(100);

  const handleFetchCustomer = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeTypeDate = (value) => {
    setTypeDate(value);
    handleDatePicker();
  };

  const handleDatePicker = () => {
    switch (typeDate) {
      case "d":
        return (
          <RangePicker
            defaultValue={[moment("2021-01-01"), moment("2021-01-31")]}
            format={dateFormat}
          />
        );
      case "m":
        return <RangePicker picker="month" />;
      // case "q":
      //   return <RangePicker picker="quarter" />;
      case "y":
        return <RangePicker picker="year" />;
    }
  };

  useEffect(() => {
    handleFetchCustomer();
  }, []);

  const data = [
    {
      type: "Tháng 1",
      sales: 38,
    },
    {
      type: "Tháng 2",
      sales: 12,
    },
    {
      type: "Tháng 3",
      sales: 26,
    },
    {
      type: "Tháng 4",
      sales: 52,
    },
    {
      type: "Tháng 5",
      sales: 67,
    },
    {
      type: "Tháng 6",
      sales: 52,
    },
    {
      type: "Tháng 7",
      sales: 52,
    },
  ];
  const config = {
    data,
    xField: "type",
    yField: "sales",
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
    meta: {
      type: {
        alias: "Tháng",
      },
      sales: {
        alias: "Doanh số",
      },
    },
  };

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href=""> Báo cáo doanh số</Breadcrumb.Item>
      </Breadcrumb>
      <Row style={{ marginTop: "20px" }} gutter={[16, 16]}>
        <Col span={3}>
          <Select
            onChange={onChangeTypeDate}
            value={typeDate}
            defaultValue="d"
            style={{ width: "100%" }}
          >
            <Select.Option value="d">Ngày</Select.Option>
            <Select.Option value="m">Tháng</Select.Option>
            {/* <Select.Option value="q">Quý</Select.Option> */}
            <Select.Option value="y">Năm</Select.Option>
          </Select>
        </Col>
        <Col span={9}>{handleDatePicker()}</Col>
        <Col span={7}>
          <Select
           style={{ width: "100%" }}
            showSearch
            placeholder="Chọn khách hàng"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {customers.map((item) => (
              <Option value={item.id}>
                {item.customerCode +
                  " - " +
                  item.name +
                  " - " +
                  item.phoneNumber}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          {" "}
          <Select
            placeholder="Trạng thái"
            style={{ width: "100%" }}
            onChange={(value) => setStatus(value)}
            value={status}
          >
                  <Option value={100}>Đã xuất hóa đơn</Option>
            <Option value={-100}>Đã hủy</Option>
      
          </Select>
        </Col>
        <Col span={24}>
          <Column style={{ paddingTop: "3rem" }} {...config} />;
        </Col>
      </Row>
    </>
  );
};
export default BillReport;
