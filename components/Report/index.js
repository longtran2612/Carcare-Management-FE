import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, Row, Select, Form, DatePicker, Button } from "antd";
import {
  ExportOutlined,
  HomeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { getReport } from "pages/api/reportAPI";
import { getCustomers } from "pages/api/customerAPI";
import { getUsers } from "pages/api/userAPI";
import Loading from "components/Loading";
import { openNotification, openNotificationWarning } from "utils/notification";
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const ReportPage = () => {
  const [form] = Form.useForm();
  const [typeDate, setTypeDate] = useState("d");
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(100);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(moment());
  const [toDate, setToDate] = useState(moment());

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
        return (
          <RangePicker
            // defaultValue={[moment("2021-01-01"), moment("2021-01-31")]}'
            format={dateFormat}
          />
        );
      case "m":
        return <RangePicker picker="month" />;
      case "y":
        return <RangePicker  picker="year" />;
    }
  };

  const onFinish = async (values) => {
    console.log(values);
    // handleDate(values);
    setLoading(true);
    let body = {
      reportType: values.reportType,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      console.log(body);
      // const response = await getReport(body);

      // const outputFilename = `bang_ke_huy_hoa_don.xlsx`;

      // // If you want to download file automatically using link attribute.
      // const url = URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', outputFilename);
      // document.body.appendChild(link);
      // link.click();

      // OR you can save/write file locally.
      // fs.writeFileSync(outputFilename, response.data);
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

  const handleDate = (values) => {
    console.log(values);
    switch (typeDate) {
      case "d":
        setFromDate(moment(values?.rangerDate[0]).startOf("day"));
        setToDate(moment(values?.rangerDate[1]).endOf("day"));
      case "m":
        setFromDate(moment(values?.rangerDate[0]).startOf("month"));
        setToDate(moment(values?.rangerDate[1]).endOf("month"));
      case "y":
        setFromDate(moment(values?.rangerDate[0]).startOf("year"));
        setToDate(moment(values?.rangerDate[1]).endOf("year"));
    }
  };

  useEffect(() => {
    handleFetchCustomer();
    handleFetchUser();
  }, []);

  return (
    <>
      <Breadcrumb style={{ margin: "5px", alignItems: "center" }}>
        <Breadcrumb.Item href="/admin">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Báo cáo</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} layout="vertical" autoComplete="off">
        <Row style={{ padding: "2rem 8rem 2rem 8rem" }} gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue={0}
              name="reportType"
              label="Loại báo cáo"
            >
              <Select
                // onChange={onChangeTypeDate}
                // value={typeDate}
                // defaultValue="d"
                style={{ width: "100%" }}
              >
                <Select.Option value={0}>Tất cả</Select.Option>
                <Select.Option value={1}>Hóa đơn hủy</Select.Option>
                <Select.Option value={2}>Theo ngày</Select.Option>
                <Select.Option value={3}>Nhân viên</Select.Option>
                <Select.Option value={4}>Khuyến mãi</Select.Option>
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
              name="typeDate"
              label="Kiểu Thời gian"
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
          <Col span={18}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name="rangerDate"
              label="Khoảng thời gian"
            >
              {handleDatePicker()}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="customer" label="Khách hàng">
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Chọn khách hàng"
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
                {customers.map((item) => (
                  <Option value={item.id}>
                    {item?.name + " - " + item?.phoneNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="user" label="Nhân viên">
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
                  <Option value={item.id}>
                    {item?.name + " - " + item?.phone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ display: "flex", justifyContent: "center" }} span={24}>
            <Button
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
              icon={<FileExcelOutlined />}
              type="primary"
              size="large"
            >
              Xuất báo cáo
            </Button>
          </Col>
          {/* <Col span={4}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
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
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
      <Loading loading={loading} />
    </>
  );
};
export default ReportPage;
