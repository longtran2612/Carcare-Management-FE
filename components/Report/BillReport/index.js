import React from "react";
import { Column } from "@ant-design/plots";
import { Breadcrumb, Col,Row } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

const BillReport = () => {
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
        <Breadcrumb.Item href="">Báo cáo doanh số</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col style={{padding:"10px"}} span={12}>
          <RangePicker
            defaultValue={[
              moment("2021-01-01", "YYYY-MM-DD"),
              moment("2021-01-31", "YYYY-MM-DD"),
            ]}
            format="YYYY-MM-DD"
          />
        </Col>
        <Col span={24}>
        <Column style={{ paddingTop: "3rem" }} {...config} />;
        </Col>
      </Row>
    </>
  );
};
export default BillReport;
