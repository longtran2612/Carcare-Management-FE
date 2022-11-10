import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  Select,
  Input,
  Drawer,
  Space,
  Divider,
  Upload,
  Typography,
  Table,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getCarModelByBrand } from "pages/api/carModel";
import { updateCar } from "pages/api/carAPI";
import { openNotification } from "utils/notification";
import Loading from "components/Loading";
const { TextArea } = Input;

function DrawerCarDetail({ car, show, onUpdate, handleCancel }) {
  const [form] = Form.useForm();
  const [carDetail, setCarDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [carModels, setCarModels] = useState([]);
  const [brandSelected, setBrandSelected] = useState("");

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

  const fetchCarModel = async (brand) => {
    try {
      const res = await getCarModelByBrand(brand);
      setCarModels(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    const carModel = carModels.find(
      (c) => c.carModelCode === values.carModelCode
    );
    console.log(carModel);
    let body = {
      name:
        (carModel?.brand || "") +
        " " +
        values.licensePlate +
        " " +
        (values.color || ""),
      color: values.color,
      licensePlate: values.licensePlate,
      carModel: values.carModelCode,
    };
    try {
      console.log(body);
      const res = await updateCar(body, carDetail?.id);
      onUpdate();
      handleCancel();
      openNotification("Thành công", "Cập nhật xe thành công");
    } catch (error) {
      if (error?.response?.data?.message) {
        openNotification(error?.response?.data?.message);
      } else {
        openNotification("Thất bại", "Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    if (car) {
      setCarDetail(car);
      setBrandSelected(car?.brand);

      form.setFieldValue("name", car.name);
      form.setFieldValue("color", car.color);
      form.setFieldValue("carModelCode", car.carModelCode);
      form.setFieldValue("brand", car.brand);
      form.setFieldValue("licensePlate", car.licensePlate);
      form.setFieldValue("description", car.description);
    }
  }, [show]);

  useEffect(() => {
    fetchCarModel(form.getFieldValue("brand"));
  }, [form, brandSelected]);

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
                <Form.Item label="Tên xe" name="name">
                  <Input disabled />
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
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Hãng xe"
                  name="brand"
                >
                  <Select
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
                    onChange={(value) => {
                      setBrandSelected(value);
                      form.setFieldsValue({ carModelCode: undefined });
                    }}
                  >
                    {brands.map((brand) => (
                      <Option key={brand}>{brand}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  label="Model"
                  name="carModelCode"
                >
                  <Select
                    showSearch
                    placeholder="Chọn Model"
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
                    {carModels.map((carModel) => (
                      <Select.Option key={carModel.carModelCode}>
                        {carModel.model}
                      </Select.Option>
                    ))}
                  </Select>
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
