import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  InputNumber,
  Upload,
  Popconfirm,
} from "antd";
import { useRouter } from "next/router";
import { getServiceById, updateService } from "pages/api/serviceAPI";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImage } from "pages/api/uploadAPI";
import { openNotification } from "utils/notification";
import { getCategories } from "pages/api/categoryAPI";
import { validateMessages } from "utils/messageForm";
import ModalQuestion from "components/Modal/ModalQuestion";
import { disableService } from "pages/api/serviceAPI";
import Loading from "components/Loading";
import ModalUploadImage from "components/Modal/ModalUploadImage";

const ServiceDetail = ({ serviceId, onUpdateService }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [serviceDetail, setServiceDetail] = useState({});
  const [categoryServices, setCategoryServices] = useState({});
  const [modalQuestion, setModalQuestion] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalUpload, setModalUpload] = useState(false);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [imageS3, setImageS3] = useState(null);

  const fetchCategoryService = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategoryServices(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log("categoryServices", categoryServices);

  const fetchServiceDetail = async () => {
    setLoading(true);
    try {
      const response = await getServiceById(serviceId);
      setServiceDetail(response.data.Data);
      form.setFieldsValue({
        name: response.data.Data.name,
        type: response.data.Data.type,
        imageUrl: response.data.Data.imageUrl,
        description: response.data.Data.description,
        categoryId: response.data.Data.categoryId,
        estimateTime: response.data.Data.estimateTime,
        status: response.data.Data.status,
        statusName: response.data.Data.statusName,
        price: response.data.Data.servicePrice?.price,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
     console.log(error);
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
        type: values.type,
        name: values.name,
        description: values.description,
        categoryId: values.categoryId,
        estimateTime: values.estimateTime,
        imageUrl: imageS3 || serviceDetail?.image,
      };
      if (values.statusName === "INACTIVE") {
        disableService(serviceId);
      }
      const res = await updateService(body, serviceDetail.id);
      openNotification("Thành công!", "Cập nhật dịch vụ thành công");
      onUpdateService();
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại", "Cập nhật bảng giá thất bại");
      }
    }
  };
  // handle upload image

  const handleFileChosen = (info) => {
    const result = info.fileList.map((file) => {
      const blob = new Blob([file.originFileObj], {
        type: file.type,
      });
      return (window.URL || window.webkitURL).createObjectURL(blob);
    });
    setListFiles({ images: info.fileList, imageBlob: result });
    setModalUpload(true);
  };

  const handleUploadImages = async () => {
    try {
      const formData = new FormData();
      listFiles.images.map((image) => {
        formData.append("files", image.originFileObj);
      });
      const response = await uploadImage(formData);
      setImageS3(response.data.Data[0]);
      setServiceDetail((prevState) => {
        return { ...prevState, imageUrl: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message[0]);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };
  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Image width={300} height={250} src={serviceDetail.imageUrl} />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Upload
              onChange={(info) => handleFileChosen(info)}
              multiple
              showUploadList={false}
              fileList={listFiles.imageBlob}
            >
              <Button icon={<UploadOutlined />}>Thay đổi hình ảnh</Button>
            </Upload>
          </div>
        </Col>
        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={[32, 32]}>
              <Col span={18}>
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
              <Col span={6}>
                <Form.Item
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="statusName"
                >
                  <Select>
                    <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                    <Select.Option value="INACTIVE">
                      Không hoạt động
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
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
                    <Select.Option value="Yêu thích">Yêu thích</Select.Option>
                    <Select.Option value="Mới">Mới</Select.Option>
                    <Select.Option value="Thường">Thông thường</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={6}>
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
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Thời gian xử lý"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="estimateTime"
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Giá"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="price"
                >
                  <InputNumber disabled="true" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={4} />
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
                      fetchServiceDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
                <div>
                  <Popconfirm
                    title="Xác nhận?"
                    placement="topLeft"
                    okText="Đồng ý"
                    cancelText="Hủy"
                    onConfirm={() => {
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
                    <Button type="primary">Cập nhật</Button>
                  </Popconfirm>
                </div>
              </div>
            </Row>
          </Form>
        </Col>
      </Row>
      <ModalUploadImage
        visible={modalUpload}
        handleCancel={() => setModalUpload(false)}
        handleOk={() => handleUploadImages()}
        listImage={listFiles.imageBlob}
      />
      <Loading loading={loading} />
    </>
  );
};

export default ServiceDetail;
