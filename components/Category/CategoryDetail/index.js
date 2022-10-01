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
import { getCategoryById, updateCategory } from "pages/api/categoryAPI";
import { openNotification } from "utils/notification";
import { getCategories } from "pages/api/categoryAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";

const CategoryDetail = ({ categoryId, onUpdateCategory }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [categoryDetail, setCategoryDetail] = useState({});
  const [categoryServices, setCategoryServices] = useState({});
  const [modalQuestion, setModalQuestion] = useState(false);



  const fetchcategoryDetail = async () => {
    try {
      const response = await getCategoryById(categoryId);
      setCategoryDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        type: response.data.Data.type,
        imageUrl: response.data.Data.imageUrl,
        description: response.data.Data.description,
        status: response.data.Data.status,
      });
    } catch (error) {
      openNotification(error.response.data);
    }
  };

  useEffect(() => {
    if (categoryId) {
        fetchcategoryDetail()
    }
  }, [categoryId]);

  const onFinish = async (values) => {
    try {
      let body = {
        id: categoryDetail.id,
        type: values.type,
        name: values.name,
        description: values.description,
        status: values.status,
      };
      const res = await updateCategory(body, categoryDetail.id);
      if (res.data.StatusCode == "200") {
        openNotification("Cập nhật dịch vụ thành công!", "");
        onUpdateCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveService = async () => {
    try {
      await removeServiceApi(categoryDetail.id);
      router.push("/admin");
      onUpdateCategory();
      setModalQuestion(false);
    } catch (error) {}
  };
  return (
    <>
      <Row>
        <Col span={6}>
          <Image width={300} height={250} src={categoryDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <Upload
              onChange={(info) => handleFileChosen(info)}
              multiple
              showUploadList={false}
              fileList={listFiles.imageBlob}
            >
              <Button icon={<UploadOutlined />}>Tải hình lên</Button>
            </Upload> */}
          </div>
        </Col>
        <Col span={15}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row>
              <Col span={11} style={{ marginRight: "20px" }}>
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
              </Col>
              <Col span={5} style={{ marginRight: "20px" }}>
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
              <Col span={5} style={{ marginRight: "20px" }}>
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
              </Col>
            </Row>
            <div className="service-action">
              {/* <Button type="danger" onClick={() => setModalQuestion(true)}>
                Xóa
              </Button> */}
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

export default CategoryDetail;
