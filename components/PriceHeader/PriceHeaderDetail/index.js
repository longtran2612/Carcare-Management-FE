import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
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
import {
  getServiceApi,
  removeServiceApi,
  updateServiceApi,
} from "api/serviceAPI";
import { openNotification } from "utils/notification";
import { getCategories } from "api/categoryAPI";
import { getPricesByHeader } from "api/priceAPI";
import { getPriceHeaderById } from "api/PriceHeaderAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";

const PriceHeaderDetail = ({ priceHeaderId, onUpdatePriceHeader }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [priceHeaderDetail, setPriceHeaderDetail] = useState({});
  const [prices, setPrices] = useState([]);
  const [modalQuestion, setModalQuestion] = useState(false);

  const fetchPrice = async () => {
    try {
      const response = await getPricesByHeader(priceHeaderId);
      console.log(response.data.Data);
      setPrices(response.data.Data);
    } catch (error) {
      openNotification(error.response.data);
    }
  };

  const fetchPriceHeaderDetail = async () => {
    try {
      const response = await getPriceHeaderById(priceHeaderId);
      setPriceHeaderDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        description: response.data.Data.description,
        fromDate: response.data.Data.fromDate,
        toDate: response.data.Data.toDate,
        status: response.data.Data.status,
      });
    } catch (error) {
      openNotification(error.response.data);
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
      render: (text, record, dataIndex) => {
        return <div>{dataIndex + 1}</div>;
      },
    },
    {
      title: "Mã giá",
      dataIndex: "id",
      key: "id",
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
      const res = await updateServiceApi(body, priceHeaderDetail.id);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật dịch vụ thành công!", "");
        onUpdatePriceHeader();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemovePriceHeader = async () => {
    try {
      await removeServiceApi(priceHeaderDetail.id);
      router.push("/admin");
      onUpdatePriceHeader();
      setModalQuestion(false);
    } catch (error) {}
  };
  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <br />
      <br />
      <Row>
        <Col span={24}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
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
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item
              label="Ngày bắt đầu"
              name="fromDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              {/* <DatePicker/> */}
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày bắt đầu"
              name="toDate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              {/* <DatePicker/> */}
              <Input />
            </Form.Item>

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
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
            <div className="service-action">
              <Button type="danger" onClick={() => setModalQuestion(true)}>
                Xóa
              </Button>
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
          </Form>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={prices}
            rowKey="id"
            />
          </Col>
      </Row>
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemovePriceHeader()}
      />
    </>
  );
};

export default PriceHeaderDetail;
