import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Select,
  Input,
  Drawer,
  Space,
  Divider,
  Typography,
  Table,
} from "antd";
import { updateCar } from "pages/api/carAPI";
import { openNotification } from "utils/notification";
import Loading from "components/Loading";
const { TextArea } = Input;

function DrawerCarDetail({ car, show, handleCancel }) {
  const [form] = Form.useForm();
  const [carDetail, setCarDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageS3, setImageS3] = useState(null);

  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });

  const [brands, setBrands] = useState([
    "Toyota",
    "VinFast",
    "Nissan",
    "Suzuki",
    "Subaru",
    "Lexus",
    "Audi",
    "Volkswagen",
    "Honda",
    "Volvo",
    "Hyundai",
    "Mazda",
    "KIA",
    "Mitsubishi",
    "Maserati",
    "Chevrolet",
    "Ford",
    "Mercedes-Benz",
    "BMW",
  ]);

  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        color: values.color,
        licensePlate: values.licensePlate,
        imageUrl: imageS3 || carDetail?.imageUrl,
      };
      console.log(body);
      const res = await updateCar(body, carDetail?.id);
      openNotification("Thành công", "Cập nhật xe thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
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
      setCarDetail((prevState) => {
        return { ...prevState, imageUrl: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      openNotification("Thất bại!", "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (car) {
      setCarDetail(car);
      form.setFieldValue("name", car.name);
      form.setFieldValue("color", car.color);
      form.setFieldValue("licensePlate", car.licensePlate);
      form.setFieldValue("imageUrl", car.imageUrl);
      form.setFieldValue("description", car.description);
    }
  }, [car]);

  const columns = [
    {
      title: "MÃ",
      dataIndex: "carCode",
      key: "carCode",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
    },
  ];

  return (
    <>
      <Drawer
        width={500}
        placement="right"
        closable
        onClose={() => {
          handleCancel();
        }}
        open={show}
        bodyStyle={{ padding: 40 }}
        extra={
          <Space>
            <Button onClick={() => handleCancel()}>Hủy</Button>
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
              type="primary"
            >
              Lưu
            </Button>
          </Space>
        }
      >
        <Divider>
          <Typography.Title level={4}>Thông tin xe</Typography.Title>
        </Divider>

        <Form form={form} layout="vertical">
          <Form form={form} layout="vertical" autoComplete="off">
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  label="Tên xe"
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
                  label="Biển số xe"
                  name="licensePlate"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Hãng xe" name="brand">
                  <Select
                    disabled
                    showSearch
                    placeholder="Chọn hãng xe"
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
                    {brands.map((brand) => (
                      <Option key={brand}>{brand}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Model" name="model">
                  <Input  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Màu sắc" name="color">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Form>
      </Drawer>

      <Loading loading={loading} />
    </>
  );
}

export default DrawerCarDetail;
