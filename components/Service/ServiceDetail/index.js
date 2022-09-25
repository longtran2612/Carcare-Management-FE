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
} from "antd";
import { useRouter } from "next/router";
import {
  getServiceApi,
  removeServiceApi,
  updateServiceApi,
} from "api/serviceAPI";
import { openNotification } from "utils/notification";
import { getCategories } from "api/categoryAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";

const ServiceDetail = ({ serviceId, onUpdateService }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [serviceDetail, setServiceDetail] = useState({});
  const [categoryServices, setCategoryServices] = useState({});
  const [modalQuestion, setModalQuestion] = useState(false);

  const fetchCategoryService = async () => {
    try {
      const response = await getCategories();
      setCategoryServices(response.data.Data);
    } catch (error) {
      openNotification(error.response.data);
    }
  };

  const fetchServiceDetail = async () => {
    try {
      const response = await getServiceApi(serviceId);
      setServiceDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        type: response.data.Data.type,
        description: response.data.Data.description,
        categoryId: response.data.Data.categoryId,
        status: response.data.Data.status,
      });
    } catch (error) {
      openNotification(error.response.data);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetail();
      fetchCategoryService();
    }
  }, [serviceId]);

  const onFinish = async (values) => {
    try {
      let body = {
        id: serviceDetail.id,
        type: values.type,
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        status: values.status,
      };
      const res = await updateServiceApi(body, serviceDetail.id);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật dịch vụ thành công!", "");
        onUpdateService();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveService = async () => {
    try {
      await removeServiceApi(serviceDetail.id);
      router.push("/admin");
      onUpdateService();
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
        <Col span={6}>
          <Image
            width={300}
            height={250}
            src="https://i.ibb.co/MfNTNJS/may-rua-xe-oto-com-vn-4-84d9.jpg"
          />
        </Col>
        <Col span={15}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Tên dịch vụ"
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
              label="Danh mục dịch vụ"
              rules={[
                {
                  required: true,
                },
              ]}
              name="categoryId"
            >
              <Select>
                {Object.keys(categoryServices).length > 0 &&
                  categoryServices?.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Kiểu dịch vụ"
              rules={[
                {
                  required: true,
                },
              ]}
              name="type"
            >
              <Select>
                <Select.Option value="HOT">HOT</Select.Option>
                <Select.Option value="LIKE">LIKE</Select.Option>
              </Select>
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
      </Row>
      <ModalQuestion
        title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
        visible={modalQuestion}
        handleCancel={() => setModalQuestion(false)}
        handleOk={() => handleRemoveService()}
      />
    </>
  );
};

export default ServiceDetail;
