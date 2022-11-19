import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Col,
  Row,
  Select,
  Form,
  DatePicker,
  Button,
  Typography,
  Table,
} from "antd";
import {
  ExportOutlined,
  HomeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getReport, getSaleReportByDate } from "pages/api/reportAPI";
import { getCustomers } from "pages/api/customerAPI";
import { getUsers } from "pages/api/userAPI";
import Loading from "components/Loading";
import { formatMoney } from "utils/format";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const SaleReport = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(100);
  const [loading, setLoading] = useState(false);
  const [dataSaleReport, setDataSaleReport] = useState([]);
  const [dataSaleReportCustomer, setDataSaleReportCustomer] = useState([]);
  // const [fromDate, setFromDate] = useState(moment());
  // const [toDate, setToDate] = useState(moment());

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

  const onChangeTypeDate = (value) => {
    setTypeDate(value);
    handleDatePicker();
  };

  const handleDatePicker = () => {
    switch (typeDate) {
      case "d":
        return <RangePicker format={dateFormat} />;
      case "m":
        return <RangePicker picker="month" />;
      case "y":
        return <RangePicker picker="year" />;
    }
  };

  const handleExportExcel = async (values) => {
    let fromDate;
    let toDate;
    if (values.typeDate === "d") {
      fromDate = values.rangerDate[0];
      toDate = values.rangerDate[1];
    }
    if (values.typeDate === "m") {
      fromDate = moment(values.rangerDate[0]).startOf("month").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("month");
    }
    if (values.typeDate === "y") {
      fromDate = moment(values.rangerDate[0]).startOf("year").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("year");
    }

    setLoading(true);
    let body = {
      reportType: 2,
      username: values.user,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const response = await getReport(body);
      setLoading(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotificationWarning(error?.response?.data?.message);
      } else {
        openNotificationWarning("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    let fromDate;
    let toDate;
    if (values.typeDate === "d") {
      fromDate = values.rangerDate[0];
      toDate = values.rangerDate[1];
    }
    if (values.typeDate === "m") {
      fromDate = moment(values.rangerDate[0]).startOf("month").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("month");
    }
    if (values.typeDate === "y") {
      fromDate = moment(values.rangerDate[0]).startOf("year").add(1, "days");
      toDate = moment(values.rangerDate[1]).endOf("year");
    }

    let body = {
      username: values.user,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const res = await getSaleReportByDate(body);
      setDataSaleReport(res.data.Data);
      setLoading(false);
    } catch (error) {}
  };

  // const handleDate = () => {
  //   console.log(form.getFieldValue('rangerDate'));
  //   switch (typeDate) {
  //     case "d":
  //       setFromDate(moment(form.getFieldValue('rangerDate') && form.getFieldValue('rangerDate')[0]).startOf("day"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("day"));
  //     case "m":
  //       setFromDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[0]).startOf("month"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("month"));
  //     case "y":
  //       setFromDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[0]).startOf("year"));
  //       setToDate(moment(form.getFieldValue('rangerDate') &&form.getFieldValue('rangerDate')[1]).endOf("year"));
  //   }
  // };
  // useEffect(() => {
  //   handleDate();
  // }, [typeDate,form]);

  useEffect(() => {
    handleFetchCustomer();
    handleFetchUser();
  }, []);

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
      title: "Mã nhân viên",
      dataIndex: "userCode",
      key: "userCode",
      render: (userCode) => <a style={{ color: "blue" }}>{userCode}</a>,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return <div>{moment(record.date).format(dateFormat)}</div>;
      },
    },
    {
      title: "Tổng tiền dịch vụ",
      dataIndex: "totalServicePrice",
      key: "totalServicePrice",
      render: (text, record) => {
        return <div>{formatMoney(record.totalServicePrice)}</div>;
      },
    },
    {
      title: "Tổng tiền khuyến mãi",
      dataIndex: "totalPromotionAmount",
      key: "totalPromotionAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.totalPromotionAmount)}</div>;
      },
    },
    {
      title: "Tổng tiền thanh toán",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (text, record) => {
        return <div>{formatMoney(record.paymentAmount)}</div>;
      },
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Báo cáo doanh số</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} autoComplete="off">
        <Row style={{ padding: "0 8rem 0 8rem" }} gutter={[16, 10]}>
          <Col span={24}>
            <Typography.Title level={2} className="content-center">
              Báo cáo doanh số
            </Typography.Title>
          </Col>

          <Col span={3}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="typeDate"
              initialValue="d"
            >
              <Select
                onChange={onChangeTypeDate}
                value={typeDate}
                style={{ width: "100%" }}
              >
                <Select.Option value="d">Ngày</Select.Option>
                <Select.Option value="m">Tháng</Select.Option>
                <Select.Option value="y">Năm</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="rangerDate"
              initialValue={[
                moment().startOf("month"),
                moment().endOf("month"),
              ]}
            >
              {handleDatePicker()}
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="user">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn nhân viên"
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
                  <Option value={item.phone}>
                    {item?.name + " - " + item?.phone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              style={{ width: "100%" }}
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
              type="dashed"
            >
              Thống kê
            </Button>
          </Col>
          <Col span={4}>
            <Button
            style={{ width: "100%" }}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleExportExcel(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
              icon={<FileExcelOutlined />}
              type="primary"
            >
              Xuất báo cáo
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered
              columns={columns}
              dataSource={dataSaleReport}
              scroll={{
                y: 280,
              }}
            />
          </Col>
        </Row>
      </Form>
      <Loading loading={loading} />
    </>
  );
};
export default SaleReport;
