import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Image,
  Button,
  Form,
  Typography,
  Input,
  Timeline,
  Upload,
  InputNumber,
} from "antd";
import { useRouter } from "next/router";
import { uploadImage } from "pages/api/uploadAPI";
import { openNotification } from "utils/notification";
import { getCarByCode, updateCar } from "pages/api/carAPI";
import { validateMessages } from "utils/messageForm";
import ModalUploadImage from "components/Modal/ModalUploadImage";
import { UploadOutlined } from "@ant-design/icons";
import Loading from "components/Loading";
const { Title } = Typography;

const CarDetail = ({ carId, onUpdateCar }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [carDetail, setCarDetail] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [carModels, setCarModels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageS3, setImageS3] = useState(null);
  const [listFiles, setListFiles] = useState({
    images: [],
    imageBlob: [],
  });
  const [modalQuestion, setModalQuestion] = useState(false);
  const fetchcarDetail = async () => {
    setLoading(true);
    try {
      const response = await getCarByCode(carId);
      setCarDetail(response.data.Data);
      console.log(response.data.Data);
      form.setFieldsValue({
        id: response.data.Data.id,
        carCode: response.data.Data.carCode,
        name: response.data.Data.name,
        color: response.data.Data.color,
        licensePlate: response.data.Data.licensePlate,
        description: response.data.Data.description,
        brand: response.data.Data.brand,
        model: response.data.Data.model,
        engine: response.data.Data.engine,
        transmission: response.data.Data.transmission,
        seats: response.data.Data.seats,
        fuel: response.data.Data.fuel,
        year: response.data.Data.year,
        imageUrl: response.data.Data.imageUrl,
        customerName: response.data.Data.customerName,
        customerPhoneNumber: response.data.Data.customerPhoneNumber,
        customerCode: response.data.Data.customerCode,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      openNotification(error.response.Message);
    }
  };

  useEffect(() => {
    if (carId) {
      fetchcarDetail();
    }
  }, [carId]);

  const onFinish = async (values) => {
    try {
      let body = {
        name: values.name,
        color: values.color,
        licensePlate: values.licensePlate,
        description: values.description,
        brand: values.brand,
        model: values.model,
        engine: values.engine,
        transmission: values.transmission,
        seats: values.seats,
        fuel: values.fuel,
        year: values.year,
        imageUrl: imageS3||  carDetail?.imageUrl,
      };
      console.log(body);
      const res = await updateCar(body, carDetail?.id);
      if (res.data.StatusCode == "200") {
        openNotification("Thành công", "Cập nhật thành công");
        onUpdateCar();
      }
    } catch (error) {
      console.log(error);
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
        return { ...prevState, image: response.data.Data[0] };
      });
      setListFiles({ images: [], imageBlob: [] });
      setModalUpload(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button type="link" size="small" onClick={() => router.push("/admin")}>
        Trở lại
      </Button>
      <Row gutter={[4, 4]}>
        <Col span={6}>
          <Image width={300} height={250} src={carDetail.imageUrl} />
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
              <Button icon={<UploadOutlined />}>Tải hình lên</Button>
            </Upload>
          </div>
          <div
            className="content-white"
            style={{
              marginTop: "20px",
              justifyContent: "center",
            }}
          >
            <Title style={{ textAlign: "center" }} level={4}>
              Người sở hữu
            </Title>
            <Timeline style={{ marginTop: "20px" }}>
              <Timeline.Item>Tên: {carDetail?.customerName}</Timeline.Item>
              <Timeline.Item>
                Số điện thoại: {carDetail?.customerPhoneNumber}
              </Timeline.Item>
              <Timeline.Item>Mã: {carDetail?.customerCode}</Timeline.Item>
            </Timeline>
          </div>
        </Col>

        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            validateMessages={validateMessages}
          >
            <Row gutter={30}>
              <Col span={18}>
                <Form.Item
                  label="Tên mẫu xe"
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
                  label="Mã xe"
                  name="carCode"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input disabled="true" />
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
              <Col span={6}>
                <Form.Item
                  label="Màu sắc"
                  name="color"
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
                  label="Hãng xe"
                  name="brand"
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
                  label="Dòng xe"
                  name="model"
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
                  label="Dung tích"
                  name="engine"
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
                  label="Truyền động"
                  name="transmission"
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
                  label="Số chỗ"
                  name="seats"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Nhiên liệu"
                  name="fuel"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
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
                      fetchcarDetail();
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
                <div>
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

export default CarDetail;
